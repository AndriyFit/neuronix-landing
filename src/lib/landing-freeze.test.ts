import { test } from 'node:test'
import assert from 'node:assert/strict'
import {
  collectFrozen,
  readFreeze,
  sectionOrder,
  FROZEN_PAGES,
  FROZEN_PATHS,
} from './landing-freeze.ts'

// Тест-охоронець заморозки Ads-посадкових. Падає не тому, що зміна погана, а тому,
// що вона коштує перезапуску вимірювання Quality Score — і це рішення має ухвалити
// людина, а не проїхати в PR серед іншого.
//
// Полагодити його правильно: npm run freeze:update -- "чому знімаємо фіксацію".
// Полагодити його неправильно: викинути шлях із FROZEN_PATHS, щоб позеленіло.
// Рівно так 01.09 зняли assert «три групи, три РІЗНІ URL» — у тому ж коміті, що й
// зміну, яку він блокував. Послаблення перевірки йде ОКРЕМИМ комітом із поясненням.

test('заморожені поля посадкових збігаються зі знімком', () => {
  const snapshot = readFreeze()
  const current = collectFrozen()

  const drifted = Object.keys(current.content).filter(
    (key) =>
      JSON.stringify(current.content[key]) !== JSON.stringify(snapshot.content?.[key]),
  )

  assert.deepEqual(
    drifted,
    [],
    `заморожені поля змінились: ${drifted.join(', ')}.\n` +
      `Сторінки під заморозкою: ${FROZEN_PAGES.join(', ')} (до ${snapshot.frozenUntil}).\n` +
      `Свідома зміна → npm run freeze:update -- "причина", і заморозка рахується заново.`,
  )
})

test('набір і порядок секцій посадкових збігаються зі знімком', () => {
  const snapshot = readFreeze()
  const current = collectFrozen()

  for (const [file, sections] of Object.entries(current.structure)) {
    assert.deepEqual(
      sections,
      snapshot.structure?.[file],
      `${file}: змінився набір або порядок секцій. Для Google це інша сторінка — ` +
        `тобто перезапуск відліку post-click score. Свідомо → npm run freeze:update.`,
    )
  }
})

test('знімок не порожній — інакше тест сліпий', () => {
  const snapshot = readFreeze()
  assert.ok(
    Object.keys(snapshot.content ?? {}).length >= FROZEN_PATHS.length,
    'у знімку менше полів, ніж у FROZEN_PATHS — знімок застарів або зіпсований',
  )
  assert.ok(snapshot.reason, 'у знімку немає причини останнього оновлення')
})

test('sectionOrder бачить порядок і не реагує на коментарі', () => {
  const withComments = `
    export default function P() {
      return (
        <>
          {/* <Fake /> — це коментар, у список він потрапити не має */}
          <Hero />
          // <AlsoFake />
          <Pricing />
          <Contact />
        </>
      )
    }`
  assert.deepEqual(sectionOrder(withComments), ['Hero', 'Pricing', 'Contact'])

  // Переставлені секції — інший список, тобто тест спрацює
  const reordered = withComments.replace('<Hero />', '<X />').replace('<Pricing />', '<Hero />')
  assert.notDeepEqual(sectionOrder(reordered), sectionOrder(withComments))
})
