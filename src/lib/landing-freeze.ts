// Заморозка Ads-посадкових: збирає ті поля, які визначають «про що ця сторінка»
// для Google, і дає їх у вигляді, придатному для порівняння зі знімком.
//
// Навіщо це існує (коротко; повністю — docs/2026-09-07-landing-freeze.md):
// 01.09 сторінку `/websites` перебудували, не спитавши, чим вона є для реклами,
// і трафік групи «Сайт під ключ» перекинули на `/price` — до групи «Ціна розробки».
// Дві групи з різними намірами знову ділили один документ; саме через це
// post_click_quality_score і був BELOW_AVERAGE. Доки на той момент існували
// й не спрацювали — тому тепер це тест, а не абзац у файлі.
//
// Механіка навмисно тупа: знімок зберігає ЗНАЧЕННЯ, не хеші. Diff у PR показує
// рядок «було → стало», тобто ревʼюер бачить саме те, що змінюється в очах Google,
// і мусить це підтвердити оновленням знімка, а не проґавити серед сотень рядків json.

import { readFileSync } from 'node:fs'

export const FREEZE_SNAPSHOT = 'snapshots/landing-freeze.json'

export const LOCALES = ['uk', 'en'] as const

/** Сторінки, які реклама віддає як посадкові (keyword-level final_urls). */
export const FROZEN_PAGES = ['/uk', '/uk/online-store', '/uk/price'] as const

/**
 * Шляхи в i18n, які заморожені. Критерій відбору — той самий, що в доці:
 * поле входить сюди, якщо воно міняє відповідь на питання «про що ця сторінка».
 * Тіла болей і описів сюди НЕ входять свідомо: інакше заморозка стає такою
 * незручною, що її почнуть обходити, а обійдена перевірка гірша за відсутню.
 */
export const FROZEN_PATHS = [
  // Головна — посадкова групи «Сайт під ключ» з 2026-09-07
  'metadata.title',
  'metadata.description',
  'hero.titleStart',
  'hero.titleHighlight',
  'hero.titleEnd',
  'hero.subtitle',
  'hero.ctaPrimary',
  'pains.title',
  'solutionGuide.title',
  'solutionGuide.items',
  'pricing.title',
  'pricing.items',
  // Заголовки сусідніх секцій — разом, бо дефект тут саме в їхній ПАРІ: 06.09
  // «Уже маєте сайт?» над формою аудиту дублювало «Коли сайт уже є» поруч.
  // Порізно кожен виглядає нормально, тому й проїхало в ревʼю.
  'services.title',
  'audit.title',
  'faq.items',

  // /online-store — група «Інтернет-магазин»
  'platforms.online-store.metadata',
  'platforms.online-store.hero',
  'platforms.online-store.pains.title',
  'platforms.online-store.solutions',
  'platforms.online-store.faq',

  // /price — група «Ціна розробки»
  'platforms.price.metadata',
  'platforms.price.hero',
  'platforms.price.pains.title',
  'platforms.price.solutions',
  'platforms.price.faq',

  // Рендериться на /online-store і несе ціни рушіїв
  'platforms.shared.techChoice',
] as const

/** Файли-сторінки, чий набір і порядок секцій заморожено. */
export const FROZEN_COMPONENTS = [
  'src/app/[locale]/page.tsx',
  'src/app/[locale]/[platform]/page.tsx',
] as const

function at(dict: unknown, path: string): unknown {
  return path.split('.').reduce<unknown>((node, key) => {
    if (node && typeof node === 'object') return (node as Record<string, unknown>)[key]
    return undefined
  }, dict)
}

/**
 * Імена секцій у порядку появи у файлі сторінки.
 * Коментарі зрізаються, тому переписування пояснення над блоком заморозку не чіпає —
 * а от доданий, прибраний чи переставлений компонент міняє список і валить тест.
 */
export function sectionOrder(source: string): string[] {
  const code = source
    .replace(/\{\s*\/\*[\s\S]*?\*\/\s*\}/g, ' ')
    .replace(/\/\*[\s\S]*?\*\//g, ' ')
    .replace(/^\s*\/\/.*$/gm, ' ')
  const body = code.slice(code.indexOf('export default'))
  return [...body.matchAll(/<([A-Z]\w*)/g)].map((m) => m[1])
}

export type Freeze = {
  /** Пояснення для того, хто відкрив файл першим — куди йти по правила. */
  note: string
  appliedAt: string
  frozenUntil: string
  reason: string
  content: Record<string, unknown>
  structure: Record<string, string[]>
}

/** Поточний стан заморожених полів — те, з чим порівнюється знімок. */
export function collectFrozen(): Pick<Freeze, 'content' | 'structure'> {
  const content: Record<string, unknown> = {}
  for (const locale of LOCALES) {
    const dict = JSON.parse(readFileSync(`src/i18n/${locale}.json`, 'utf-8'))
    for (const path of FROZEN_PATHS) {
      const value = at(dict, path)
      if (value === undefined) {
        throw new Error(
          `${locale}.json: заморожений шлях «${path}» зник. Якщо поле прибрано свідомо — ` +
            `прибери його і з FROZEN_PATHS у src/lib/landing-freeze.ts, окремим комітом із поясненням.`,
        )
      }
      content[`${locale}:${path}`] = value
    }
  }

  const structure: Record<string, string[]> = {}
  for (const file of FROZEN_COMPONENTS) {
    structure[file] = sectionOrder(readFileSync(file, 'utf-8'))
  }

  return { content, structure }
}

export function readFreeze(): Freeze {
  return JSON.parse(readFileSync(FREEZE_SNAPSHOT, 'utf-8'))
}
