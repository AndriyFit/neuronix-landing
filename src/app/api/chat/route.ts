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

export async function POST(req: NextRequest) {
  try {
    const { sessionId, message, locale, landingPath, distinctId, utm } = await req.json()
    if (!UUID.test(String(sessionId ?? ''))) {
      return NextResponse.json({ error: 'bad_session' }, { status: 400 })
    }
    const valid = validateMessage(message)
    if (!valid.ok) return NextResponse.json({ error: valid.reason }, { status: 400 })

    const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown'
    const ipHash = hashIp(ip, process.env.CHAT_IP_SALT ?? 'neuronix')

    const limit = await checkLimits(sessionId, ipHash)
    if (!limit.ok) {
      return NextResponse.json({ error: 'rate_limited', retryAfter: limit.retryAfter }, { status: 429 })
    }

    await touchSession(sessionId, { locale, landingPath, distinctId, ipHash, utm })
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

        const [leadRes] = await Promise.allSettled([
          saveLead({ source: 'chat', name: args.name, contact: args.phone, message: args.message, siteUrl: args.url }),
          sendTelegram(text),
          sendEmail(subject, text),
        ])
        const leadId = leadRes.status === 'fulfilled' ? leadRes.value : null
        if (leadId) await linkLead(sessionId, leadId)
        leadCreated = Boolean(leadId)
        await appendMessage(sessionId, { role: 'tool', content: JSON.stringify(args), toolName: 'submit_lead' })
      }
    }

    const reply = String(choice?.content ?? '').trim() || fallback(locale)
    await appendMessage(sessionId, { role: 'model', content: reply })
    return NextResponse.json({ reply, leadCreated })
  } catch (e) {
    console.error('Chat route error:', e)
    return NextResponse.json({ reply: fallback() }, { status: 503 })
  }
}
