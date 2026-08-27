import assert from 'node:assert'
import { test } from 'node:test'
import { SYSTEM_INSTRUCTION, SUBMIT_LEAD_TOOL, parseLeadArgs } from './chat-prompt.ts'

test('промпт містить актуальні факти й не містить вигаданих', () => {
  for (const fact of ['від $350', 'від $1000', 'від $500', '12 місяц', 'neuronixjhbot', 'Андрій']) {
    assert.ok(SYSTEM_INSTRUCTION.includes(fact), `бракує факту: ${fact}`)
  }
  for (const junk of ['Jetson', 'Edge AI', 'світлодіод', '$1350', '$550']) {
    assert.ok(!SYSTEM_INSTRUCTION.includes(junk), `застаріле/вигадане в промпті: ${junk}`)
  }
})

test('інструмент описаний у форматі OpenAI', () => {
  assert.equal(SUBMIT_LEAD_TOOL.type, 'function')
  assert.equal(SUBMIT_LEAD_TOOL.function.name, 'submit_lead')
  assert.deepEqual(SUBMIT_LEAD_TOOL.function.parameters.required, ['name', 'phone'])
})

test('parseLeadArgs відкидає сміття, а не падає', () => {
  assert.equal(parseLeadArgs('не json'), null)
  assert.equal(parseLeadArgs('{"name":"Андрій"}'), null, 'без phone — невалідно')
  assert.equal(parseLeadArgs('{"phone":"050"}'), null, 'без name — невалідно')
  const ok = parseLeadArgs('{"name":"Андрій","phone":"0501234567","message":"лендінг"}')
  assert.equal(ok?.name, 'Андрій')
  assert.equal(ok?.phone, '0501234567')
})
