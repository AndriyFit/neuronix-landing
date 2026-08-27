import { NextRequest, NextResponse } from 'next/server'
import { LIMITS, checkLimits, validateMessage } from '@/lib/chat-limits'
import { SUBMIT_LEAD_TOOL, SYSTEM_INSTRUCTION, parseLeadArgs } from '@/lib/chat-prompt'
import { appendMessage, getHistory, hashIp, linkLead, touchSession, trimHistory } from '@/lib/chat-store'
import { createGatewayParser } from '@/lib/chat-stream'
import { saveLead } from '@/lib/leads'
import { sendEmail, sendTelegram } from '@/lib/lead-notify'

const GATEWAY = 'https://ai-gateway.vercel.sh/v1/chat/completions'
const MODEL = 'google/gemini-2.5-flash'
const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i

// До 6 послідовних звернень до D1 + виклик моделі + доставка заявки — дефолтний
// ліміт Vercel (10с на Hobby / Fluid) може обірвати запит посеред цього ланцюжка.
export const maxDuration = 60

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
      // stream: true — відповідь віддається по мірі генерації. Без цього людина
      // дивиться на «Друкує...» весь час генерації, а потім отримує стіну тексту
      // одним куском: незрозуміло, де початок відповіді, і доводиться скролити вгору.
      body: JSON.stringify({
        model: MODEL,
        messages,
        temperature: 0.2,
        max_tokens: 1200,
        tools: [SUBMIT_LEAD_TOOL],
        stream: true,
      }),
    })
    if (!ai.ok || !ai.body) {
      console.error('Gateway error:', ai.status, ai.ok ? 'no body' : await ai.text())
      return NextResponse.json({ reply: fallback(locale) }, { status: 503 })
    }

    // NDJSON, а не SSE: клієнту потрібен лише потік об'єктів, а рамка `data: ` +
    // порожній рядок нічого тут не додає. Помилкові стани (400/429/503) лишаються
    // звичайним JSON зі своїм статусом — віджет розрізняє їх за Content-Type.
    const encoder = new TextEncoder()
    const ndjson = new ReadableStream<Uint8Array>({
      async start(controller) {
        const send = (obj: unknown) => controller.enqueue(encoder.encode(JSON.stringify(obj) + '\n'))
        let full = ''
        let toolName = ''
        let toolArgs = ''

        try {
          const reader = ai.body!.getReader()
          const decoder = new TextDecoder()
          const parse = createGatewayParser()
          for (;;) {
            const { value, done } = await reader.read()
            if (done) break
            for (const ev of parse(decoder.decode(value, { stream: true }))) {
              if (ev.text) {
                full += ev.text
                send({ delta: ev.text })
              }
              // Аргументи інструмента приходять шматками — їх треба склеїти,
              // ім'я ж приходить лише в першому кадрі виклику.
              if (ev.toolName) toolName = ev.toolName
              if (ev.toolArgs) toolArgs += ev.toolArgs
            }
          }
        } catch (e) {
          console.error('Chat stream error:', e)
        }

        let leadCreated = false
        let leadContact: string | undefined
        try {
          // Інструмент виконує СЕРВЕР. У згенерованому коді це робив браузер — тоді заявку
          // можна підробити запитом повз чат, а source 'chat' нічого не вартий.
          if (toolName === 'submit_lead') {
            const args = parseLeadArgs(toolArgs)
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
          if (!full.trim()) {
            // Порожня відповідь без заявки — єдиний стан, який мовчки перетворювався на
            // «Не вдалося обробити» і не лишав по собі СЛІДУ в логах. Тепер лишає.
            if (!leadCreated) console.error('Chat: empty model reply', { hadToolCall: Boolean(toolName) })
            full = leadCreated ? leadConfirmation(locale) : fallback(locale)
            send({ delta: full })
          }
          await appendMessage(sessionId, { role: 'model', content: full })
        } catch (e) {
          console.error('Chat post-stream error:', e)
        }

        // reply дублює те, що вже пішло шматками — навмисно. Шматок може не доїхати
        // (обрив, приспана вкладка, проміжний проксі), і тоді людина бачила fallback,
        // хоч відповідь була згенерована й записана в D1 — саме це сталося 27.08.
        // Фінальний рядок малий і приходить одним шматком, тож служить джерелом
        // правди: віджет добирає з нього те, чого не отримав потоком.
        send({ done: true, leadCreated, reply: full, ...(leadContact ? { contact: leadContact } : {}) })
        controller.close()
      },
    })

    return new Response(ndjson, {
      headers: {
        'Content-Type': 'application/x-ndjson; charset=utf-8',
        'Cache-Control': 'no-store',
        // Інакше проксі може накопичити відповідь і віддати одним куском — тобто
        // рівно те, заради усунення чого тут і стоїть stream.
        'X-Accel-Buffering': 'no',
      },
    })
  } catch (e) {
    console.error('Chat route error:', e)
    return NextResponse.json({ reply: fallback(locale) }, { status: 503 })
  }
}
