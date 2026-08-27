import assert from 'node:assert'
import { test } from 'node:test'
import { LIMITS, validateMessage } from './chat-limits.ts'

test('порожнє й нетекстове відхиляється', () => {
  assert.equal(validateMessage('').ok, false)
  assert.equal(validateMessage('   ').ok, false)
  assert.equal(validateMessage(null).ok, false)
  assert.equal(validateMessage(42).ok, false)
})

test('надто довге відхиляється, межа включна', () => {
  const max = 'я'.repeat(LIMITS.maxMessageChars)
  assert.equal(validateMessage(max).ok, true, 'рівно межа — приймаємо')
  assert.equal(validateMessage(max + 'я').ok, false, 'на символ більше — ні')
})

test('нормальне повідомлення проходить і обрізається по краях', () => {
  const r = validateMessage('  скільки коштує лендінг?  ')
  assert.equal(r.ok, true)
  assert.equal(r.ok && r.text, 'скільки коштує лендінг?')
})
