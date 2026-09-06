import { test } from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'

// Ціна в цьому проєкті живе не в одному місці: pricing.items, solutionGuide, services,
// techChoice, hero кожної посадкової, metadata, FAQ — і в обох мовах. За серпень-вересень
// розбіжність між ними спливала тричі: сітлінки Ads обіцяли одне, посадкова інше;
// hero /price казав «магазин від $1000» над карткою «від $500»; картка головної вела
// «від $500» на сторінку, чий <title> каже «від $1000».
//
// Постійної перевірки не було — тільки правило в CLAUDE.md і людська уважність.
// Цей тест робить джерелом правди `pricing.items` і падає, щойно в текстах
// з'являється сума, якої в прайсі немає.

const LOCALES = ['uk', 'en'] as const

function load(locale: string): unknown {
  return JSON.parse(readFileSync(`src/i18n/${locale}.json`, 'utf-8'))
}

/** Усі суми в доларах із будь-якого рядка словника, з шляхом до нього. */
function collectAmounts(node: unknown, path = ''): Array<{ path: string; amount: number }> {
  if (typeof node === 'string') {
    return [...node.matchAll(/\$(\d+)/g)].map((m) => ({ path, amount: Number(m[1]) }))
  }
  if (Array.isArray(node)) {
    return node.flatMap((v, i) => collectAmounts(v, `${path}[${i}]`))
  }
  if (node && typeof node === 'object') {
    return Object.entries(node).flatMap(([k, v]) => collectAmounts(v, path ? `${path}.${k}` : k))
  }
  return []
}

for (const locale of LOCALES) {
  test(`${locale}: жодної суми поза pricing.items`, () => {
    const dict = load(locale) as Record<string, any>
    const allowed = new Set(
      collectAmounts(dict.pricing.items).map((a) => a.amount),
    )
    assert.ok(allowed.size > 0, 'pricing.items не містить жодної суми — тест сліпий')

    const stray = collectAmounts(dict).filter((a) => !allowed.has(a.amount))
    assert.deepEqual(
      stray,
      [],
      `суми, яких немає в прайсі: ${stray.map((s) => `$${s.amount} у ${s.path}`).join(', ')}`,
    )
  })
}

test('прайси uk і en збігаються числами', () => {
  const [uk, en] = LOCALES.map((l) => {
    const d = load(l) as Record<string, any>
    return collectAmounts(d.pricing.items).map((a) => a.amount)
  })
  // Ціни в доларах однакові в обох мовах — розбіжність означала б, що одну локаль
  // забули оновити, і англомовний відвідувач бачить стару вартість.
  assert.deepEqual(uk, en)
})
