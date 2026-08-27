import assert from 'node:assert'
import { test } from 'node:test'
import { parseInline, parseReply } from './chat-format.ts'

test('жирний розбирається, зірочки не лишаються в тексті', () => {
  const got = parseInline('Вартість починається **від $350**.')
  assert.deepEqual(got, [
    { text: 'Вартість починається ' },
    { text: 'від $350', bold: true },
    { text: '.' },
  ])
})

test('кілька жирних в одному рядку', () => {
  const got = parseInline('**від $350**, строк — **5–10 днів**')
  assert.deepEqual(
    got.filter((i) => i.bold).map((i) => i.text),
    ['від $350', '5–10 днів'],
  )
})

test('непарна зірочка лишається звичайним текстом', () => {
  assert.deepEqual(parseInline('ціна ** від'), [{ text: 'ціна ** від' }])
})

test('посилання стає href, кінцева крапка лишається текстом', () => {
  const got = parseInline('Пишіть: https://t.me/neuronixjhbot.')
  assert.deepEqual(got, [
    { text: 'Пишіть: ' },
    { text: 'https://t.me/neuronixjhbot', href: 'https://t.me/neuronixjhbot' },
    { text: '.' },
  ])
})

test('порожній рядок ділить абзаци', () => {
  const blocks = parseReply('Перший абзац.\n\nДругий абзац.')
  assert.deepEqual(
    blocks.map((b) => b.type),
    ['p', 'p'],
  )
  assert.equal(blocks[1].lines[0][0].text, 'Другий абзац.')
})

test('переноси всередині абзацу зберігаються окремими рядками', () => {
  const blocks = parseReply('рядок один\nрядок два')
  assert.equal(blocks.length, 1)
  assert.equal(blocks[0].lines.length, 2)
})

test('маркери — * і • дають один список без самих маркерів', () => {
  const blocks = parseReply('- перше\n* друге\n• третє')
  assert.equal(blocks.length, 1)
  assert.equal(blocks[0].type, 'ul')
  assert.deepEqual(
    blocks[0].lines.map((l) => l[0].text),
    ['перше', 'друге', 'третє'],
  )
})

test('нумерований список теж список, номер прибирається', () => {
  const blocks = parseReply('1. перше\n2) друге')
  assert.equal(blocks[0].type, 'ul')
  assert.deepEqual(
    blocks[0].lines.map((l) => l[0].text),
    ['перше', 'друге'],
  )
})

test('абзац перед списком і після нього не склеюються', () => {
  const blocks = parseReply('Що входить:\n- сайт\n- CRM\nЦіна від $350')
  assert.deepEqual(
    blocks.map((b) => b.type),
    ['p', 'ul', 'p'],
  )
})

test('жирний усередині елемента списку працює', () => {
  const blocks = parseReply('- лендінг **від $350**')
  assert.deepEqual(blocks[0].lines[0], [{ text: 'лендінг ' }, { text: 'від $350', bold: true }])
})

test('порожній вхід не дає блоків', () => {
  assert.deepEqual(parseReply(''), [])
  assert.deepEqual(parseReply('\n\n   \n'), [])
})

test('текст без розмітки лишається одним абзацом', () => {
  const blocks = parseReply('Просто відповідь без нічого.')
  assert.deepEqual(blocks, [{ type: 'p', lines: [[{ text: 'Просто відповідь без нічого.' }]] }])
})
