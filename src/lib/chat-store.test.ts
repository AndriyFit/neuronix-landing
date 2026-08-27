import assert from 'node:assert'
import { test } from 'node:test'
import { hashIp, trimHistory } from './chat-store.ts'

test('hashIp — стабільний і не містить сирої адреси', () => {
  const a = hashIp('203.0.113.7', 'sait')
  const b = hashIp('203.0.113.7', 'sait')
  assert.equal(a, b, 'той самий вхід має давати той самий хеш')
  assert.ok(!a.includes('203.0.113.7'), 'сира IP не має потрапляти в хеш')
  assert.notEqual(a, hashIp('203.0.113.8', 'sait'), 'різні адреси — різні хеші')
  assert.notEqual(a, hashIp('203.0.113.7', 'insha'), 'сіль має впливати')
})

test('trimHistory лишає останні N і не рве пари', () => {
  const msgs = Array.from({ length: 30 }, (_, i) => ({ role: 'user' as const, content: `m${i}` }))
  const out = trimHistory(msgs, 10)
  assert.equal(out.length, 10)
  assert.equal(out[9].content, 'm29', 'мають лишитись САМЕ останні')
  assert.equal(trimHistory(msgs, 100).length, 30, 'коротша історія не доповнюється')
})
