import assert from 'node:assert/strict'
import test from 'node:test'
import { splitTestimonialsIntoColumns } from './testimonials.ts'

test('splits ten testimonials into two columns of five', () => {
  const columns = splitTestimonialsIntoColumns(Array.from({ length: 10 }, (_, i) => i))

  assert.deepEqual(columns, [[0, 1, 2, 3, 4], [5, 6, 7, 8, 9]])
})
