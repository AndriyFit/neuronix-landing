import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  try {
    const { name, phone, message } = await req.json()

    if (!name || !phone) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    const botToken = process.env.TELEGRAM_BOT_TOKEN
    const chatId = process.env.TELEGRAM_CHAT_ID

    if (!botToken || !chatId) {
      return NextResponse.json({ error: 'Not configured' }, { status: 500 })
    }

    const text = [
      '🔔 *Нова заявка з neuronix.work*',
      '',
      `👤 *Ім'я:* ${name}`,
      `📞 *Телефон:* ${phone}`,
      message ? `💬 *Повідомлення:* ${message}` : null,
    ]
      .filter(Boolean)
      .join('\n')

    const res = await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ chat_id: chatId, text, parse_mode: 'Markdown' }),
    })

    if (!res.ok) {
      const err = await res.text()
      console.error('Telegram API error:', err)
      return NextResponse.json({ error: 'Delivery failed' }, { status: 500 })
    }

    return NextResponse.json({ ok: true })
  } catch (e) {
    console.error('Contact route error:', e)
    return NextResponse.json({ error: 'Internal error' }, { status: 500 })
  }
}
