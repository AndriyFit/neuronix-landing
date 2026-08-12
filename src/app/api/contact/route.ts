import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  try {
    const { name, phone, message, url, source } = await req.json()
    const isAudit = source === 'audit'

    // Audit requests come from a 2-field form: site URL + a way to reach back.
    if (!phone || (isAudit ? !url : !name)) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    const botToken = process.env.TELEGRAM_BOT_TOKEN
    const chatId = process.env.TELEGRAM_CHAT_ID

    if (!botToken || !chatId) {
      return NextResponse.json({ error: 'Not configured' }, { status: 500 })
    }

    const text = [
      isAudit ? '🔍 Запит на аудит з neuronics.work' : '🔔 Нова заявка з neuronics.work',
      '',
      url ? `🌐 Сайт: ${url}` : null,
      name ? `👤 Ім'я: ${name}` : null,
      `📞 Контакт: ${phone}`,
      message ? `💬 Повідомлення: ${message}` : null,
    ]
      .filter(Boolean)
      .join('\n')

    const res = await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ chat_id: chatId, text }),
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
