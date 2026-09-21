import assert from 'node:assert/strict'
import test from 'node:test'
import { readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'

const stylesheet = readFileSync(
  fileURLToPath(new URL('../components/css/Testimonials.css', import.meta.url)),
  'utf8',
)

test('uses two independent testimonial columns on desktop', () => {
  const desktopStyles = stylesheet.split('@media')[0]

  assert.match(
    desktopStyles,
    /\.testimonials-list\s*\{[^}]*grid-template-columns:\s*repeat\(2, minmax\(0, 1fr\)\);/,
  )
})
