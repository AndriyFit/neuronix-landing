import { NextRequest, NextResponse } from 'next/server'
import { LIMITS, checkLimits, validateMessage } from '@/lib/chat-limits'
import { SUBMIT_LEAD_TOOL, SYSTEM_INSTRUCTION, parseLeadArgs } from '@/lib/chat-prompt'
import { appendMessage, getHistory, hashIp, linkLead, touchSession, trimHistory } from '@/lib/chat-store'
import { saveLead } from '@/lib/leads'
import { sendEmail, sendTelegram } from '@/lib/lead-notify'

const GATEWAY = 'https://ai-gateway.vercel.sh/v1/chat/completions'
const MODEL = 'google/gemini-2.5-flash'
const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i

const tg = 'https://t.me/neuronixjhbot'
const fallback = (locale?: string) =>
  locale === 'en'
    ? `Sorry — I can't reply right now. Please message us directly: ${tg}`
    : `Вибачте, зараз не можу відповісти. Напишіть, будь ласка, напряму: ${tg}`
const leadConfirmation = (locale?: string) =>
  locale === 'en'
    ? "Done — I've passed it to the team. They'll be in touch during business hours."
    : 'Готово, передав команді. Зв’яжуться в робочий час.'

// req.json() зазвичай дає string; будь-що інше (число, об'єкт) обрізати нема сенсу — просто в базу не пише.
const str = (v: unknown, max: number) => (typeof v === 'string' ? v.slice(0, max) : undefined)

export async function POST(req: NextRequest) {
  let locale: string | undefined
  try {
    const body = await req.json()
    const { sessionId, message, landingPath, distinctId, utm } = body
    locale = body.locale
    if (!UUID.test(String(sessionId ?? ''))) {
      return NextResponse.json({ error: 'bad_session' }, { status: 400 })
    }
    const valid = validateMessage(message)
    if (!valid.ok) return NextResponse.json({ error: valid.reason }, { status: 400 })

    const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown'
    const ipHash = hashIp(ip, process.env.CHAT_IP_SALT || 'neuronix')

    const limit = await checkLimits(sessionId, ipHash)
    if (!limit.ok) {
      return NextResponse.json({ error: 'rate_limited', retryAfter: limit.retryAfter }, { status: 429 })
    }

    await touchSession(sessionId, {
      locale: str(locale, 10),
      landingPath: str(landingPath, 500),
      distinctId: str(distinctId, 200),
      ipHash,
      utm: utm && typeof utm === 'object'
        ? { source: str(utm.source, 200), medium: str(utm.medium, 200), campaign: str(utm.campaign, 200) }
        : undefined,
    })
    const history = trimHistory(await getHistory(sessionId, LIMITS.historyDepth), LIMITS.historyDepth)
    await appendMessage(sessionId, { role: 'user', content: valid.text })

    const key = process.env.AI_GATEWAY_API_KEY
    if (!key) return NextResponse.json({ reply: fallback(locale) }, { status: 503 })

    const messages = [
      { role: 'system', content: SYSTEM_INSTRUCTION },
      // tool-повідомлення лишаються в D1 для аудиту, але в модель не йдуть:
      // службовий JSON виклику інструмента як репліка користувача — це сміття в контексті.
      ...history
        .filter((m) => m.role !== 'tool')
        .map((m) => ({ role: m.role === 'model' ? 'assistant' : 'user', content: m.content })),
      { role: 'user', content: valid.text },
    ]

    const ai = await fetch(GATEWAY, {
      method: 'POST',
      headers: { Authorization: `Bearer ${key}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ model: MODEL, messages, temperature: 0.2, max_tokens: 1200, tools: [SUBMIT_LEAD_TOOL] }),
    })
    if (!ai.ok) {
      console.error('Gateway error:', ai.status, await ai.text())
      return NextResponse.json({ reply: fallback(locale) }, { status: 503 })
    }

    const data = await ai.json()
    const choice = data?.choices?.[0]?.message
    let leadCreated = false

    // Інструмент виконує СЕРВЕР. У згенерованому коді це робив браузер — тоді заявку
    // можна підробити запитом повз чат, а source 'chat' нічого не вартий.
    const call = choice?.tool_calls?.[0]
    let leadContact: string | undefined
    if (call?.function?.name === 'submit_lead') {
      const args = parseLeadArgs(call.function.arguments ?? '')
      if (args) {
        // Заявка мусить дійти до людини так само, як із форми: сховище (saveLead) саме
        // по собі нікого не сповіщає, тому лід без Telegram/email лишається втраченим.
        const subject = '💬 Нова заявка з чату neuronics.work'
        const text = [
          subject,
          '',
          args.url ? `🌐 Сайт: ${args.url}` : null,
          `👤 Ім'я: ${args.name}`,
          `📞 Контакт: ${args.phone}`,
          args.message ? `💬 Повідомлення: ${args.message}` : null,
        ]
          .filter(Boolean)
          .join('\n')

        const [leadRes, tgRes, mailRes] = await Promise.allSettled([
          saveLead({ source: 'chat', name: args.name, contact: args.phone, message: args.message, siteUrl: args.url }),
          sendTelegram(text),
          sendEmail(subject, text),
        ])
        // Дзеркало api/contact: saveLead — не канал доставки, delivered міряється лише
        // двома реальними каналами. Мовчазний збій обох — це рівно втрачений лід.
        const delivered = [tgRes, mailRes].some((r) => r.status === 'fulfilled' && r.value)
        if (!delivered) console.error('Chat lead delivery failed on every channel:', [tgRes, mailRes])

        const leadId = leadRes.status === 'fulfilled' ? leadRes.value : null
        if (leadId) await linkLead(sessionId, leadId)
        leadCreated = Boolean(leadId)
        // Віддаємо назад те саме, що людина щойно ввела в цьому діалозі — нічого нового
        // про неї не розкривається. Потрібно віджету для posthog.identify().
        if (leadCreated) leadContact = args.phone
        await appendMessage(sessionId, { role: 'tool', content: JSON.stringify(args), toolName: 'submit_lead' })
      }
    }

    // tool_calls штатно приходить із порожнім content (OpenAI-сумісний формат) — це
    // не збій. На успішній заявці порожній content означає "готово", а не "вибачте".
    const reply = String(choice?.content ?? '').trim() || (leadCreated ? leadConfirmation(locale) : fallback(locale))
    await appendMessage(sessionId, { role: 'model', content: reply })
    return NextResponse.json({ reply, leadCreated, ...(leadContact ? { contact: leadContact } : {}) })
  } catch (e) {
    console.error('Chat route error:', e)
    return NextResponse.json({ reply: fallback(locale) }, { status: 503 })
  }
}
