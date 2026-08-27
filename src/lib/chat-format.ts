/**
 * Розмітка відповіді агента.
 *
 * Модель пише markdown-ом — і без розбору `**від $350**` показувалось людині
 * рівно так, із зірочками. Повноцінний markdown-рендерер тут не потрібен і
 * шкідливий: це чужий HTML у нашій сторінці. Розбираємо рівно те, що модель
 * реально вживає (жирний, списки, абзаци, посилання), решта лишається текстом.
 *
 * Повертаємо структуру, а не HTML: компонент рендерить її звичайними React-
 * вузлами, тож dangerouslySetInnerHTML не потрібен ніде.
 */

export type Inline = { text: string; bold?: boolean; href?: string }
export type Block = { type: 'p' | 'ul'; lines: Inline[][] }

const BULLET = /^\s*(?:[-*•]|\d+[.)])\s+/
const INLINE = /(\*\*[^*]+\*\*)|(https?:\/\/[^\s<>]+)/g

/** Розбирає один рядок на жирні шматки й посилання. */
export function parseInline(line: string): Inline[] {
  const out: Inline[] = []
  let last = 0
  for (const m of line.matchAll(INLINE)) {
    const at = m.index ?? 0
    if (at > last) out.push({ text: line.slice(last, at) })
    if (m[1]) {
      out.push({ text: m[1].slice(2, -2), bold: true })
    } else if (m[2]) {
      // Кома чи крапка в кінці речення — не частина адреси.
      const url = m[2].replace(/[.,;:!?)]+$/, '')
      out.push({ text: url, href: url })
      const tail = m[2].slice(url.length)
      if (tail) out.push({ text: tail })
    }
    last = at + m[0].length
  }
  if (last < line.length) out.push({ text: line.slice(last) })
  return out.length ? out : [{ text: line }]
}

/**
 * Ріже відповідь на блоки. Порожній рядок — межа абзацу; рядки-марковані
 * підряд збираються в один список (модель нумерує їх по-різному, тому маркер
 * прибираємо й малюємо свій).
 */
export function parseReply(src: string): Block[] {
  const blocks: Block[] = []
  let para: Inline[][] = []
  let list: Inline[][] = []

  const flushPara = () => {
    if (para.length) blocks.push({ type: 'p', lines: para })
    para = []
  }
  const flushList = () => {
    if (list.length) blocks.push({ type: 'ul', lines: list })
    list = []
  }

  for (const raw of src.split('\n')) {
    const line = raw.trimEnd()
    if (!line.trim()) {
      flushList()
      flushPara()
      continue
    }
    if (BULLET.test(line)) {
      flushPara()
      list.push(parseInline(line.replace(BULLET, '')))
      continue
    }
    flushList()
    para.push(parseInline(line))
  }
  flushList()
  flushPara()
  return blocks
}
