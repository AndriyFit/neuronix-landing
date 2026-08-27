// Delivery channels for a new lead — shared by the contact form and the chat agent.
// Storage (leads.ts) is not a delivery channel: a lead saved to D1 that nobody was
// notified about is still a lost lead. These two functions are that notification.

export async function sendTelegram(text: string): Promise<boolean> {
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
export async function sendEmail(subject: string, text: string): Promise<boolean> {
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
