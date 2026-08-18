import { NextRequest, NextResponse } from 'next/server'
import { saveLead } from '@/lib/leads'

async function sendTelegram(text: string) {
  const botToken = process.env.TELEGRAM_BOT_TOKEN
  const chatId = process.env.TELEGRAM_CHAT_ID
  if (!botToken || !chatId) return false

  const res = await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ chat_id: chatId, text }),
  })
  if (!res.ok) console.error('Telegram API error:', await res.text())
  return res.ok
}

// Second, independent copy of the lead. A Telegram outage or a bad token must not
// be the difference between having a lead and losing it. Unset env = channel skipped.
async function sendEmail(subject: string, text: string) {
  const key = process.env.RESEND_API_KEY
  const to = process.env.LEAD_EMAIL_TO
  if (!key || !to) return false

  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: { Authorization: `Bearer ${key}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      from: process.env.LEAD_EMAIL_FROM ?? 'onboarding@resend.dev',
      to,
      subject,
      text,
    }),
  })
  if (!res.ok) console.error('Resend API error:', await res.text())
  return res.ok
}

export async function POST(req: NextRequest) {
  try {
    const { name, phone, message, url, source } = await req.json()
    const isAudit = source === 'audit'

    // Audit requests come from a 2-field form: site URL + a way to reach back.
    if (!phone || (isAudit ? !url : !name)) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    const subject = isAudit
      ? '🔍 Запит на аудит з neuronics.work'
      : '🔔 Нова заявка з neuronics.work'

    const text = [
      subject,
      '',
      url ? `🌐 Сайт: ${url}` : null,
      name ? `👤 Ім'я: ${name}` : null,
      `📞 Контакт: ${phone}`,
      message ? `💬 Повідомлення: ${message}` : null,
    ]
      .filter(Boolean)
      .join('\n')

    // Storage runs alongside delivery but is excluded from `delivered` on purpose:
    // a lead that got stored while nobody was notified is still a failed lead.
    const [tgRes, mailRes] = await Promise.allSettled([
      sendTelegram(text),
      sendEmail(subject, text),
      saveLead({
        source: isAudit ? 'audit' : 'form',
        name,
        contact: phone,
        message,
        siteUrl: url,
      }),
    ])
    const delivered = [tgRes, mailRes].some((r) => r.status === 'fulfilled' && r.value)

    if (!delivered) {
      console.error('Lead delivery failed on every channel:', [tgRes, mailRes])
      return NextResponse.json({ error: 'Delivery failed' }, { status: 500 })
    }

    return NextResponse.json({ ok: true })
  } catch (e) {
    console.error('Contact route error:', e)
    return NextResponse.json({ error: 'Internal error' }, { status: 500 })
  }
}
