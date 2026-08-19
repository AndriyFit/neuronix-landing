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
// Sent through Gmail on the account we already hold an OAuth refresh token for —
// no extra mail vendor, no domain verification.
async function sendEmail(subject: string, text: string) {
  const clientId = process.env.GMAIL_CLIENT_ID
  const clientSecret = process.env.GMAIL_CLIENT_SECRET
  const refreshToken = process.env.GMAIL_REFRESH_TOKEN
  const to = process.env.LEAD_EMAIL_TO
  if (!clientId || !clientSecret || !refreshToken || !to) return false

  // Access tokens live an hour, so every send starts by minting a fresh one.
  const tokenRes = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      client_id: clientId,
      client_secret: clientSecret,
      refresh_token: refreshToken,
      grant_type: 'refresh_token',
    }),
  })
  if (!tokenRes.ok) {
    console.error('Gmail token refresh failed:', tokenRes.status, await tokenRes.text())
    return false
  }
  const { access_token: accessToken } = await tokenRes.json()

  // Subject is Cyrillic and raw UTF-8 is illegal in a header — hence the RFC 2047 wrapper.
  const mime = [
    `To: ${to}`,
    `Subject: =?UTF-8?B?${Buffer.from(subject).toString('base64')}?=`,
    'Content-Type: text/plain; charset="UTF-8"',
    '',
    text,
  ].join('\r\n')

  const res = await fetch('https://gmail.googleapis.com/gmail/v1/users/me/messages/send', {
    method: 'POST',
    headers: { Authorization: `Bearer ${accessToken}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ raw: Buffer.from(mime).toString('base64url') }),
  })
  if (!res.ok) console.error('Gmail send error:', res.status, await res.text())
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
