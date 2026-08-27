/**
 * Ліміти для /api/chat.
 *
 * Ендпоінт публічний і ходить у платну модель — без обмежень це відкритий гаманець.
 * Лічильники читаємо з наявних таблиць чату: окреме сховище лімітів було б третьою
 * копією тих самих даних.
 */
import { d1 } from './chat-store.ts'

export const LIMITS = {
  perSession: 40,
  perIpPerHour: 60,
  maxMessageChars: 2000,
  historyDepth: 20,
} as const

export function validateMessage(text: unknown): { ok: true; text: string } | { ok: false; reason: string } {
  if (typeof text !== 'string') return { ok: false, reason: 'not_a_string' }
  const trimmed = text.trim()
  if (!trimmed) return { ok: false, reason: 'empty' }
  if (trimmed.length > LIMITS.maxMessageChars) return { ok: false, reason: 'too_long' }
  return { ok: true, text: trimmed }
}

export async function checkLimits(sessionId: string, ipHash: string): Promise<{ ok: boolean; retryAfter?: number }> {
  const [sess] = await d1(
    "SELECT COUNT(*) AS n FROM chat_messages WHERE session_id = ? AND role = 'user'",
    [sessionId],
  )
  if (Number(sess?.n ?? 0) >= LIMITS.perSession) return { ok: false, retryAfter: 3600 }

  const [ip] = await d1(
    `SELECT COUNT(*) AS n FROM chat_messages m
     JOIN chat_sessions s ON s.id = m.session_id
     WHERE s.ip_hash = ? AND m.created_at > strftime('%Y-%m-%dT%H:%M:%SZ','now','-1 hour')`,
    [ipHash],
  )
  if (Number(ip?.n ?? 0) >= LIMITS.perIpPerHour) return { ok: false, retryAfter: 3600 }

  return { ok: true }
}
