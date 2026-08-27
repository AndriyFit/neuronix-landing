/**
 * Історія чату в тому ж D1, де живуть ліди.
 *
 * Зберігаємо ВСІ діалоги, не лише ті, що дали заявку: діалоги без ліда — єдине місце,
 * де видно, на якому питанні агент втрачає людину. Заради цього все й робиться.
 *
 * Як і в leads.ts: порожні env = сховище просто вимкнене. Але тут, на відміну від лідів,
 * запис в історію не критичний — падіння D1 не має ламати відповідь у чаті.
 */
import { createHash } from 'node:crypto'

export type ChatRole = 'user' | 'model' | 'tool'
export type ChatMessage = { role: ChatRole; content: string; toolName?: string }
export type SessionMeta = {
  locale?: string
  landingPath?: string
  distinctId?: string
  ipHash?: string
  utm?: { source?: string; medium?: string; campaign?: string }
}

/** IP потрібна лише щоб порівнювати запити між собою — сира адреса для цього не потрібна. */
export function hashIp(ip: string, salt: string): string {
  return createHash('sha256').update(`${salt}:${ip}`).digest('hex').slice(0, 32)
}

/** У модель іде хвіст розмови: повна історія роздуває запит і вартість без користі. */
export function trimHistory(msgs: ChatMessage[], limit: number): ChatMessage[] {
  return msgs.length <= limit ? msgs : msgs.slice(-limit)
}

export async function d1(sql: string, params: unknown[] = []): Promise<Record<string, unknown>[]> {
  const account = process.env.CF_ACCOUNT_ID
  const database = process.env.CF_D1_LEADS_ID
  const token = process.env.CF_D1_TOKEN
  if (!account || !database || !token) return []

  const res = await fetch(
    `https://api.cloudflare.com/client/v4/accounts/${account}/d1/database/${database}/query`,
    {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ sql, params }),
    },
  )
  if (!res.ok) {
    console.error('D1 chat query failed:', res.status, await res.text())
    return []
  }
  const body = await res.json()
  return body?.result?.[0]?.results ?? []
}

export async function touchSession(id: string, meta: SessionMeta): Promise<void> {
  await d1(
    `INSERT INTO chat_sessions (id, last_seen_at, locale, landing_path, posthog_distinct_id, ip_hash, utm_source, utm_medium, utm_campaign)
     VALUES (?, strftime('%Y-%m-%dT%H:%M:%SZ','now'), ?, ?, ?, ?, ?, ?, ?)
     ON CONFLICT(id) DO UPDATE SET
       last_seen_at = strftime('%Y-%m-%dT%H:%M:%SZ','now'),
       posthog_distinct_id = COALESCE(excluded.posthog_distinct_id, posthog_distinct_id)`,
    [id, meta.locale ?? null, meta.landingPath ?? null, meta.distinctId ?? null, meta.ipHash ?? null,
     meta.utm?.source ?? null, meta.utm?.medium ?? null, meta.utm?.campaign ?? null],
  )
}

export async function appendMessage(sessionId: string, m: ChatMessage): Promise<void> {
  await d1('INSERT INTO chat_messages (session_id, role, content, tool_name) VALUES (?, ?, ?, ?)',
    [sessionId, m.role, m.content, m.toolName ?? null])
}

export async function getHistory(sessionId: string, limit: number): Promise<ChatMessage[]> {
  const rows = await d1(
    'SELECT role, content, tool_name FROM chat_messages WHERE session_id = ? ORDER BY id DESC LIMIT ?',
    [sessionId, limit],
  )
  return rows.reverse().map((r) => ({
    role: r.role as ChatRole,
    content: String(r.content),
    toolName: (r.tool_name as string) ?? undefined,
  }))
}

export async function linkLead(sessionId: string, leadId: number): Promise<void> {
  await d1('UPDATE chat_sessions SET lead_id = ? WHERE id = ?', [leadId, sessionId])
}
