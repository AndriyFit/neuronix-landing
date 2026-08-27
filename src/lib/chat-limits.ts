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

/**
 * Лічильник недоступний = блокуємо (fail closed).
 *
 * `COUNT(*)` завжди повертає рівно один рядок, тож порожній масив від d1() означає саме
 * помилку, а не «нуль». Пропускати запит у цей момент — значить лишати платний ендпоінт
 * без захисту рівно тоді, коли база моргає: флуд і бот на це не чекають.
 * Ціна протилежного вибору мала: віджет на 429 показує Telegram, тобто людина не в глухому куті.
 */
export function counted(rows: Record<string, unknown>[]): number | null {
  const first = rows[0]
  if (!first) return null            // порожньо від COUNT(*) = збій запиту
  const n = Number(first.n)
  return Number.isFinite(n) ? n : null
}

export async function checkLimits(sessionId: string, ipHash: string): Promise<{ ok: boolean; retryAfter?: number }> {
  const sess = counted(await d1(
    "SELECT COUNT(*) AS n FROM chat_messages WHERE session_id = ? AND role = 'user'",
    [sessionId],
  ))
  if (sess === null || sess >= LIMITS.perSession) return { ok: false, retryAfter: 3600 }

  // role = 'user' і тут теж: один хід людини породжує ще й відповідь моделі, а часом
  // і tool-рядок. Без фільтра «60 на годину» означало б ~20 реальних ходів — утричі
  // суворіше, ніж каже назва константи.
  const ip = counted(await d1(
    `SELECT COUNT(*) AS n FROM chat_messages m
     JOIN chat_sessions s ON s.id = m.session_id
     WHERE s.ip_hash = ? AND m.role = 'user'
       AND m.created_at > strftime('%Y-%m-%dT%H:%M:%SZ','now','-1 hour')`,
    [ipHash],
  ))
  if (ip === null || ip >= LIMITS.perIpPerHour) return { ok: false, retryAfter: 3600 }

  return { ok: true }
}
