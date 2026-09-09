// Оновлює знімок заморозки: npm run freeze:update -- "причина зміни"
//
// Причина обовʼязкова і лягає у файл. Це не бюрократія: сам сенс заморозки в тому,
// що зняття фіксації коштує перезапуску експерименту з Quality Score, і той, хто
// його перезапускає, має назватись у git blame разом із мотивом.
import { writeFileSync } from 'node:fs'
import { collectFrozen, readFreeze, FREEZE_SNAPSHOT, type Freeze } from '../src/lib/landing-freeze.ts'

const reason = process.argv.slice(2).join(' ').trim()
if (!reason) {
  console.error('Вкажи причину: npm run freeze:update -- "чому знімаємо фіксацію"')
  process.exit(1)
}

let previous: Partial<Freeze> = {}
try {
  previous = readFreeze()
} catch {
  // перший запуск — знімка ще немає
}

const NOTE =
  'Заморозка Ads-посадкових. Правила й стоп-правило: docs/2026-09-07-landing-freeze.md. ' +
  'Не редагувати руками — npm run freeze:update -- "причина".'

const today = new Date().toISOString().slice(0, 10)
// note/appliedAt/frozenUntil переносяться зі старого знімка: перший прогін їх губив,
// бо обʼєкт збирався лише з полів Freeze — і пояснення «як цим користуватись»
// зникало з файла рівно тоді, коли в нього хтось уперше заглядав.
const freeze: Freeze = {
  note: previous.note ?? NOTE,
  appliedAt: previous.appliedAt ?? today,
  frozenUntil: previous.frozenUntil ?? today,
  reason,
  ...collectFrozen(),
}

writeFileSync(FREEZE_SNAPSHOT, JSON.stringify(freeze, null, 2) + '\n', 'utf-8')
console.log(`${FREEZE_SNAPSHOT} оновлено. Причина: ${reason}`)
console.log(
  'Якщо ця зміна перезапускає заморозку — постав нові appliedAt/frozenUntil у файлі вручну ' +
    'і запиши рішення в CLAUDE.md.',
)
