// Until now a lead existed in exactly one copy — a message in the owner's personal
// Telegram. Lose that message and the lead is gone, with no history and no way to
// tie spend to revenue. Every lead is therefore also written to D1.
//
// Storage is deliberately NOT a delivery channel: a failed write must never block
// or fail the notification that actually reaches a human.

type LeadSource = 'form' | 'audit' | 'telegram' | 'telegram_start' | 'chat'

export type Lead = {
  source: LeadSource
  name?: string | null
  contact?: string | null
  message?: string | null
  siteUrl?: string | null
  tgChatId?: string | null
  tgUsername?: string | null
}

const SQL =
  'INSERT INTO leads (source, name, contact, message, site_url, tg_chat_id, tg_username) VALUES (?, ?, ?, ?, ?, ?, ?)'

export async function saveLead(lead: Lead): Promise<number | null> {
  const account = process.env.CF_ACCOUNT_ID
  const database = process.env.CF_D1_LEADS_ID
  const token = process.env.CF_D1_TOKEN
  // Unset env = storage disabled, same convention as the email channel.
  if (!account || !database || !token) return null

  try {
    const res = await fetch(
      `https://api.cloudflare.com/client/v4/accounts/${account}/d1/database/${database}/query`,
      {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sql: SQL,
          params: [
            lead.source,
            lead.name ?? null,
            lead.contact ?? null,
            lead.message ?? null,
            lead.siteUrl ?? null,
            lead.tgChatId ?? null,
            lead.tgUsername ?? null,
          ],
        }),
      },
    )
    if (!res.ok) {
      console.error('D1 lead write failed:', res.status, await res.text())
      return null
    }
    const body = await res.json()
    const id = body?.result?.[0]?.meta?.last_row_id
    return typeof id === 'number' ? id : null
  } catch (e) {
    console.error('D1 lead write threw:', e)
    return null
  }
}
