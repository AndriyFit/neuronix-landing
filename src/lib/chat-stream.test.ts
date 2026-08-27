import assert from 'node:assert'
import { test } from 'node:test'
import { createGatewayParser, createNdjsonParser } from './chat-stream.ts'

const sse = (obj: unknown) => `data: ${JSON.stringify(obj)}\n`
const textFrame = (s: string) => sse({ choices: [{ delta: { content: s } }] })

test('gateway: текст склеюється з кількох кадрів', () => {
  const feed = createGatewayParser()
  const got = [...feed(textFrame('Ві')), ...feed(textFrame('таю')), ...feed(textFrame('!'))]
  assert.deepEqual(got.map((e) => e.text).join(''), 'Вітаю!')
})

test('gateway: кадр, розірваний посеред JSON, збирається з двох шматків', () => {
  const feed = createGatewayParser()
  const frame = textFrame('привіт')
  const cut = Math.floor(frame.length / 2)
  assert.deepEqual(feed(frame.slice(0, cut)), [], 'половина кадру ще нічого не дає')
  assert.deepEqual(
    feed(frame.slice(cut)).map((e) => e.text),
    ['привіт'],
  )
})

test('gateway: кілька кадрів в одному мережевому шматку', () => {
  const feed = createGatewayParser()
  const got = feed(textFrame('а') + textFrame('б') + textFrame('в'))
  assert.deepEqual(
    got.map((e) => e.text),
    ['а', 'б', 'в'],
  )
})

test('gateway: [DONE] і порожні рядки ігноруються', () => {
  const feed = createGatewayParser()
  assert.deepEqual(feed('\n\ndata: [DONE]\n\n'), [])
})

test('gateway: зіпсований кадр не вбиває наступні', () => {
  const feed = createGatewayParser()
  const got = feed('data: {не json\n' + textFrame('далі'))
  assert.deepEqual(
    got.map((e) => e.text),
    ['далі'],
  )
})

test('gateway: ім’я інструмента з першого кадру, аргументи — з наступних', () => {
  const feed = createGatewayParser()
  const frames = [
    sse({ choices: [{ delta: { tool_calls: [{ function: { name: 'submit_lead', arguments: '{"na' } }] } }] }),
    sse({ choices: [{ delta: { tool_calls: [{ function: { arguments: 'me":"Оле' } }] } }] }),
    sse({ choices: [{ delta: { tool_calls: [{ function: { arguments: 'г"}' } }] } }] }),
  ]
  const got = frames.flatMap((f) => feed(f))
  assert.equal(got.find((e) => e.toolName)?.toolName, 'submit_lead')
  assert.equal(got.map((e) => e.toolArgs ?? '').join(''), '{"name":"Олег"}')
})

test('gateway: кадр без delta (лише usage/finish_reason) нічого не додає', () => {
  const feed = createGatewayParser()
  assert.deepEqual(feed(sse({ choices: [{ finish_reason: 'stop' }], usage: { total_tokens: 10 } })), [])
})

test('ndjson: об’єкти по рядках, розрив посеред рядка переживається', () => {
  const feed = createNdjsonParser()
  assert.deepEqual(feed('{"delta":"а"}\n{"delta":"б"}\n'), [{ delta: 'а' }, { delta: 'б' }])
  assert.deepEqual(feed('{"done":true,"lead'), [], 'пів рядка — ще нічого')
  assert.deepEqual(feed('Created":true}\n'), [{ done: true, leadCreated: true }])
})

test('ndjson: незакритий хвіст без \\n не віддається (і не ламає парсер)', () => {
  const feed = createNdjsonParser()
  assert.deepEqual(feed('{"delta":"хвіст"}'), [])
})
