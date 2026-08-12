import { NextRequest, NextResponse } from 'next/server'

const GREETING =
  'Вітаємо! Це Neuronix — розробка сайтів, інтеграції та автоматизація.\n\n' +
  'Опишіть задачу одним повідомленням: що за бізнес, що треба зробити, у які терміни. ' +
  'Відповімо протягом робочого дня.'

async function tg(method: string, body: Record<string, unknown>) {
  const res = await fetch(`https://api.telegram.org/bot${process.env.TELEGRAM_BOT_TOKEN}/${method}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })
  if (!res.ok) console.error(`Telegram ${method} failed:`, await res.text())
  return res.ok
}

// Two-way bridge between site visitors and the owner's personal Telegram.
// Visitor -> bot -> owner (header line carries the visitor id), owner replies to
// that message -> bot copies it back to the visitor.
export async function POST(req: NextRequest) {
  try {
    const secret = process.env.TELEGRAM_WEBHOOK_SECRET
    if (!secret || req.headers.get('x-telegram-bot-api-secret-token') !== secret) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const owner = process.env.TELEGRAM_CHAT_ID
    if (!owner || !process.env.TELEGRAM_BOT_TOKEN) {
      return NextResponse.json({ ok: true })
    }

    const msg = (await req.json())?.message
    if (!msg?.chat?.id) return NextResponse.json({ ok: true })

    const chatId = String(msg.chat.id)

    if (chatId === owner) {
      // The id is parsed back out of the header line the bridge itself wrote.
      // forward_from is a fallback and is absent when the visitor hides forwards.
      const quoted = msg.reply_to_message
      const target = quoted?.text?.match(/#id(\d+)/)?.[1] ?? quoted?.forward_from?.id
      if (!target) {
        // Form leads carry no Telegram chat at all — the visitor left a phone or email.
        const isFormLead = /^[\u{1F514}\u{1F50D}]/u.test(quoted?.text ?? '')
        await tg('sendMessage', {
          chat_id: owner,
          text: isFormLead
            ? 'Це заявка з форми — Telegram-чату з цим клієнтом не існує. Пишіть на контакт, указаний у заявці.'
            : 'Відповісти можна лише на повідомлення з 💬 у першому рядку — це ті, що клієнт написав боту.',
        })
        return NextResponse.json({ ok: true })
      }
      await tg('copyMessage', { chat_id: target, from_chat_id: owner, message_id: msg.message_id })
      return NextResponse.json({ ok: true })
    }

    if (msg.text === '/start') {
      await tg('sendMessage', { chat_id: chatId, text: GREETING })
      return NextResponse.json({ ok: true })
    }

    const who = [msg.from?.first_name, msg.from?.last_name].filter(Boolean).join(' ') || 'Без імені'
    const username = msg.from?.username ? ` @${msg.from.username}` : ''
    await tg('sendMessage', {
      chat_id: owner,
      text: `💬 ${who}${username} · #id${chatId}\n\n${msg.text ?? '[вкладення нижче]'}`,
    })
    if (!msg.text) {
      await tg('copyMessage', { chat_id: owner, from_chat_id: chatId, message_id: msg.message_id })
    }

    return NextResponse.json({ ok: true })
  } catch (e) {
    console.error('Telegram webhook error:', e)
    // Always 200 — a non-2xx makes Telegram retry the same update indefinitely.
    return NextResponse.json({ ok: true })
  }
}
