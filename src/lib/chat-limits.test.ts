import assert from 'node:assert'
import { test } from 'node:test'
import { LIMITS, validateMessage, counted } from './chat-limits.ts'

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

test('counted(): порожній масив → null', () => {
  assert.equal(counted([]), null)
})

test('counted(): рядок з нечисловим n → null', () => {
  assert.equal(counted([{ n: 'not-a-number' }]), null)
  assert.equal(counted([{ n: NaN }]), null)
  assert.equal(counted([{ n: Infinity }]), null)
})

test('counted(): рядок з числовим n → число', () => {
  assert.equal(counted([{ n: 0 }]), 0)
  assert.equal(counted([{ n: 42 }]), 42)
  assert.equal(counted([{ n: 3.5 }]), 3.5)
})
