/**
 * Розбір потокових відповідей чату.
 *
 * Два формати, дві функції — навмисно окремі, бо це два різні стики:
 *   - SSE від AI Gateway (`data: {...}` рядками) читає роут `/api/chat`;
 *   - NDJSON від нашого ж роуту (по одному JSON на рядок) читає ChatWidget.
 *
 * Обидва парсери тримають власний буфер, бо мережевий шматок обривається
 * будь-де — хоч посеред UTF-8 символу, хоч посеред JSON. Саме цей стан і робить
 * їх вартими окремого модуля: у роуті він був би вплетений у цикл читання й
 * ніяк не перевірявся б, а тут покритий тестами на рвані межі шматків.
 */

export type GatewayDelta = {
  /** Текст відповіді. Приходить дрібними шматками, їх треба склеювати. */
  text?: string
  /** Ім'я інструмента — приходить лише в першому кадрі виклику. */
  toolName?: string
  /** Шматок JSON-аргументів інструмента. Теж склеюється. */
  toolArgs?: string
}

type Feed<T> = (chunk: string) => T[]

/** Розбирає SSE від gateway. `[DONE]` і зіпсовані кадри мовчки пропускаються. */
export function createGatewayParser(): Feed<GatewayDelta> {
  let buf = ''
  return (chunk) => {
    buf += chunk
    const out: GatewayDelta[] = []
    let nl: number
    while ((nl = buf.indexOf('\n')) >= 0) {
      const line = buf.slice(0, nl).trim()
      buf = buf.slice(nl + 1)
      if (!line.startsWith('data:')) continue
      const payload = line.slice(5).trim()
      if (!payload || payload === '[DONE]') continue

      let frame: unknown
      try {
        frame = JSON.parse(payload)
      } catch {
        // Один зіпсований кадр не має вбивати відповідь, яка вже пішла людині.
        continue
      }
      const delta = (frame as { choices?: { delta?: Record<string, unknown> }[] })?.choices?.[0]?.delta
      if (!delta) continue

      const event: GatewayDelta = {}
      if (typeof delta.content === 'string' && delta.content) event.text = delta.content
      const call = (delta as { tool_calls?: { function?: { name?: string; arguments?: string } }[] }).tool_calls?.[0]
      if (call?.function?.name) event.toolName = call.function.name
      if (typeof call?.function?.arguments === 'string') event.toolArgs = call.function.arguments
      if (event.text || event.toolName || event.toolArgs !== undefined) out.push(event)
    }
    return out
  }
}

/** Розбирає NDJSON нашого роуту: по одному JSON-об'єкту на рядок. */
export function createNdjsonParser(): Feed<Record<string, unknown>> {
  let buf = ''
  return (chunk) => {
    buf += chunk
    const out: Record<string, unknown>[] = []
    let nl: number
    while ((nl = buf.indexOf('\n')) >= 0) {
      const line = buf.slice(0, nl).trim()
      buf = buf.slice(nl + 1)
      if (!line) continue
      try {
        out.push(JSON.parse(line))
      } catch {
        // Обірваний рядок нічого не додає — решта відповіді вже на екрані.
      }
    }
    return out
  }
}
