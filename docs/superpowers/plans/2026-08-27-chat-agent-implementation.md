# Чат-агент neuronics.work — план імплементації

> **Для агентних виконавців:** ОБОВ'ЯЗКОВИЙ СУБ-СКІЛ — `superpowers:subagent-driven-development`
> (рекомендовано) або `superpowers:executing-plans`. Кроки мають чекбокси (`- [ ]`) для відстеження.

**Мета:** віджет чату на neuronics.work, який відповідає на питання, кваліфікує відвідувача,
сам оформлює заявку в наявний лід-пайплайн і зберігає всі діалоги.

**Архітектура:** клієнтський віджет шле повідомлення на `/api/chat`. Роут тримає системний
промпт на сервері, читає історію з D1, кличе Vercel AI Gateway (`google/gemini-2.5-flash`)
з інструментом `submit_lead`, і сам виконує цей інструмент — створює лід через уже наявний
`saveLead()` + Telegram + Gmail. Усі повідомлення пишуться в D1.

**Стек:** Next.js 16 App Router · TypeScript · Cloudflare D1 (REST) · Vercel AI Gateway ·
PostHog · GTM. Тести — вбудований `node --test` (Node 25 виконує TS нативно, нових залежностей нема).

**Спека:** `docs/superpowers/specs/2026-08-27-chat-agent-design.md`

## Глобальні обмеження

- **Стиль:** без Tailwind і UI-бібліотек. Один CSS-файл на компонент у `src/components/css/`.
- **Тексти:** усі рядки інтерфейсу — в `src/i18n/uk.json` + `en.json`, **дзеркально**. Хардкоду української в компонентах не залишати.
- **Деплой:** тільки `git push` у `main`. `vercel deploy` з локалки заборонений.
- **Секрети:** тільки Vercel env + Vault. У репо — лише імена змінних у `.env.example`.
- **Копірайт:** ніде не називати технології, якими ми працюємо (Vapi, n8n, LLM, webhook). Клієнт купує результат.
- **Ціни й строки:** єдине джерело — `src/i18n/uk.json`. Промпт звіряється скриптом `docs/ai-agent/check-prompt-facts.py`.
- **Аналітика не має права ламати конверсію:** будь-який виклик `track()` — у `try/catch` і ПІСЛЯ `sendGTMEvent`.
- **Порожня env = фіча вимкнена**, а не помилка. Той самий патерн, що в PostHog, GTM і D1.
- **Модель:** `google/gemini-2.5-flash`, `temperature: 0.2`.
- **Скрол:** сторінка скролиться в `#page-scroll`, не в `document`. `position: fixed` + `backdrop-filter` на iOS заборонено.

---

### Task 1: Схема D1 для історії чату

**Файли:**
- Створити: `migrations/0001_chat.sql`
- Створити: `scripts/apply-migration.sh`

**Інтерфейси:**
- Продукує: таблиці `chat_sessions`, `chat_messages` у базі `neuronix-leads` (`75d3b6c1-0559-4d80-a0cf-38ad0e25065a`).

- [ ] **Крок 1: Написати міграцію**

`migrations/0001_chat.sql`:

```sql
CREATE TABLE IF NOT EXISTS chat_sessions (
  id                  TEXT PRIMARY KEY,
  created_at          TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%SZ','now')),
  last_seen_at        TEXT,
  locale              TEXT,
  landing_path        TEXT,
  posthog_distinct_id TEXT,
  ip_hash             TEXT,
  utm_source          TEXT,
  utm_medium          TEXT,
  utm_campaign        TEXT,
  lead_id             INTEGER
);

CREATE TABLE IF NOT EXISTS chat_messages (
  id         INTEGER PRIMARY KEY AUTOINCREMENT,
  session_id TEXT NOT NULL,
  created_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%SZ','now')),
  role       TEXT NOT NULL,
  content    TEXT NOT NULL,
  tool_name  TEXT
);

CREATE INDEX IF NOT EXISTS idx_chat_messages_session ON chat_messages(session_id, id);
CREATE INDEX IF NOT EXISTS idx_chat_sessions_lead    ON chat_sessions(lead_id);
CREATE INDEX IF NOT EXISTS idx_chat_sessions_ip      ON chat_sessions(ip_hash, created_at);
```

`ip_hash` — саме хеш, не адреса: для ліміту достатньо порівнювати, зберігати сиру IP немає підстав.

- [ ] **Крок 2: Скрипт застосування**

`scripts/apply-migration.sh`:

```bash
#!/usr/bin/env bash
# Застосовує SQL-файл до D1 neuronix-leads через REST (binding недоступний — сайт на Vercel).
set -euo pipefail
FILE="${1:?вкажи шлях до .sql}"
VAULT_KEY="$(sed -n 's/^VAULT_API_KEY=//p' /etc/default/vault-cache)"
TOKEN="$(curl -s -H "X-API-Key: $VAULT_KEY" \
  http://127.0.0.1:8400/api/secrets/abertime/cloudflare_api_token \
  | python3 -c 'import json,sys;print(json.load(sys.stdin)["value"])')"
ACC=2c4c514716008ce7795e40ac9e0cd04c
DB=75d3b6c1-0559-4d80-a0cf-38ad0e25065a
python3 - "$FILE" <<'PY' | while read -r stmt; do
import sys
sql = open(sys.argv[1], encoding='utf-8').read()
# D1 REST виконує один стейтмент за виклик — ріжемо по ";" і чистимо переноси.
for s in filter(None, (x.strip() for x in sql.split(';'))):
    print(' '.join(s.split()))
PY
  echo "→ ${stmt:0:60}..."
  curl -s -X POST "https://api.cloudflare.com/client/v4/accounts/$ACC/d1/database/$DB/query" \
    -H "Authorization: Bearer $TOKEN" -H "Content-Type: application/json" \
    -d "$(python3 -c 'import json,sys;print(json.dumps({"sql":sys.argv[1]}))' "$stmt")" \
    | python3 -c 'import json,sys;d=json.load(sys.stdin);print("  ok" if d.get("success") else "  ПОМИЛКА: "+json.dumps(d.get("errors"),ensure_ascii=False))'
done
```

- [ ] **Крок 3: Застосувати й перевірити**

```bash
chmod +x scripts/apply-migration.sh
./scripts/apply-migration.sh migrations/0001_chat.sql
```

Очікується: `ok` на кожному стейтменті.

Перевірка (перечитуванням, не довірою до відповіді):

```bash
VAULT_KEY="$(sed -n 's/^VAULT_API_KEY=//p' /etc/default/vault-cache)"
TOKEN="$(curl -s -H "X-API-Key: $VAULT_KEY" http://127.0.0.1:8400/api/secrets/abertime/cloudflare_api_token | python3 -c 'import json,sys;print(json.load(sys.stdin)["value"])')"
curl -s -X POST "https://api.cloudflare.com/client/v4/accounts/2c4c514716008ce7795e40ac9e0cd04c/d1/database/75d3b6c1-0559-4d80-a0cf-38ad0e25065a/query" \
 -H "Authorization: Bearer $TOKEN" -H "Content-Type: application/json" \
 -d '{"sql":"SELECT name FROM sqlite_master WHERE type=?1"}' -d '{"params":["table"]}' 2>/dev/null || \
curl -s -X POST "https://api.cloudflare.com/client/v4/accounts/2c4c514716008ce7795e40ac9e0cd04c/d1/database/75d3b6c1-0559-4d80-a0cf-38ad0e25065a/query" \
 -H "Authorization: Bearer $TOKEN" -H "Content-Type: application/json" \
 -d '{"sql":"SELECT name FROM sqlite_master WHERE type = '"'"'table'"'"'"}'
```

Очікується: у списку є `chat_sessions` і `chat_messages`.

- [ ] **Крок 4: Коміт**

```bash
git add migrations/0001_chat.sql scripts/apply-migration.sh
git commit -m "feat: схема D1 для історії чату"
```

---

### Task 2: Сховище історії чату

**Файли:**
- Створити: `src/lib/chat-store.ts`
- Створити: `src/lib/chat-store.test.ts`

**Інтерфейси:**
- Споживає: таблиці з Task 1.
- Продукує:
  - `type ChatRole = 'user' | 'model' | 'tool'`
  - `type ChatMessage = { role: ChatRole; content: string; toolName?: string }`
  - `type SessionMeta = { locale?: string; landingPath?: string; distinctId?: string; ipHash?: string; utm?: { source?: string; medium?: string; campaign?: string } }`
  - `async function d1(sql: string, params?: unknown[]): Promise<Record<string, unknown>[]>`
  - `async function touchSession(id: string, meta: SessionMeta): Promise<void>`
  - `async function appendMessage(sessionId: string, m: ChatMessage): Promise<void>`
  - `async function getHistory(sessionId: string, limit: number): Promise<ChatMessage[]>`
  - `async function linkLead(sessionId: string, leadId: number): Promise<void>`
  - `function hashIp(ip: string, salt: string): string`

- [ ] **Крок 1: Написати падаючий тест**

`src/lib/chat-store.test.ts`:

```typescript
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
```

- [ ] **Крок 2: Запустити тест — має впасти**

Run: `node --test src/lib/chat-store.test.ts`
Очікується: FAIL, `Cannot find module './chat-store.ts'`

- [ ] **Крок 3: Мінімальна реалізація**

`src/lib/chat-store.ts`:

```typescript
/**
 * Історія чату в тому ж D1, де живуть ліди.
 *
 * Зберігаємо ВСІ діалоги, не лише ті, що дали заявку: діалоги без ліда — єдине місце,
 * де видно, на якому питанні агент втрачає людину. Заради цього все й робиться.
 *
 * Як і в leads.ts: порожні env = сховище просто вимкнене. Але тут, на відміну від лідів,
 * запис в історію не критичний — падіння D1 не має ламати відповідь у чаті.
 */
import { createHash } from 'node:crypto'

export type ChatRole = 'user' | 'model' | 'tool'
export type ChatMessage = { role: ChatRole; content: string; toolName?: string }
export type SessionMeta = {
  locale?: string
  landingPath?: string
  distinctId?: string
  ipHash?: string
  utm?: { source?: string; medium?: string; campaign?: string }
}

/** IP потрібна лише щоб порівнювати запити між собою — сира адреса для цього не потрібна. */
export function hashIp(ip: string, salt: string): string {
  return createHash('sha256').update(`${salt}:${ip}`).digest('hex').slice(0, 32)
}

/** У модель іде хвіст розмови: повна історія роздуває запит і вартість без користі. */
export function trimHistory(msgs: ChatMessage[], limit: number): ChatMessage[] {
  return msgs.length <= limit ? msgs : msgs.slice(-limit)
}

export async function d1(sql: string, params: unknown[] = []): Promise<Record<string, unknown>[]> {
  const account = process.env.CF_ACCOUNT_ID
  const database = process.env.CF_D1_LEADS_ID
  const token = process.env.CF_D1_TOKEN
  if (!account || !database || !token) return []

  // try/catch навколо всієї мережі — як у leads.ts. Сховище не має права ламати відповідь
  // у чаті: виняток fetch (DNS, timeout, обрив) мусить стати порожнім результатом, не падінням.
  try {
    const res = await fetch(
      `https://api.cloudflare.com/client/v4/accounts/${account}/d1/database/${database}/query`,
      {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ sql, params }),
      },
    )
    if (!res.ok) {
      console.error('D1 chat query failed:', res.status, await res.text())
      return []
    }
    const body = await res.json()
    return body?.result?.[0]?.results ?? []
  } catch (e) {
    console.error('D1 chat query threw:', e)
    return []
  }
}

export async function touchSession(id: string, meta: SessionMeta): Promise<void> {
  await d1(
    `INSERT INTO chat_sessions (id, last_seen_at, locale, landing_path, posthog_distinct_id, ip_hash, utm_source, utm_medium, utm_campaign)
     VALUES (?, strftime('%Y-%m-%dT%H:%M:%SZ','now'), ?, ?, ?, ?, ?, ?, ?)
     ON CONFLICT(id) DO UPDATE SET
       last_seen_at = strftime('%Y-%m-%dT%H:%M:%SZ','now'),
       posthog_distinct_id = COALESCE(excluded.posthog_distinct_id, posthog_distinct_id)`,
    [id, meta.locale ?? null, meta.landingPath ?? null, meta.distinctId ?? null, meta.ipHash ?? null,
     meta.utm?.source ?? null, meta.utm?.medium ?? null, meta.utm?.campaign ?? null],
  )
}

export async function appendMessage(sessionId: string, m: ChatMessage): Promise<void> {
  await d1('INSERT INTO chat_messages (session_id, role, content, tool_name) VALUES (?, ?, ?, ?)',
    [sessionId, m.role, m.content, m.toolName ?? null])
}

export async function getHistory(sessionId: string, limit: number): Promise<ChatMessage[]> {
  const rows = await d1(
    'SELECT role, content, tool_name FROM chat_messages WHERE session_id = ? ORDER BY id DESC LIMIT ?',
    [sessionId, limit],
  )
  return rows.reverse().map((r) => ({
    role: r.role as ChatRole,
    content: String(r.content),
    toolName: (r.tool_name as string) ?? undefined,
  }))
}

export async function linkLead(sessionId: string, leadId: number): Promise<void> {
  await d1('UPDATE chat_sessions SET lead_id = ? WHERE id = ?', [leadId, sessionId])
}
```

- [ ] **Крок 4: Запустити тест — має пройти**

Run: `node --test src/lib/chat-store.test.ts`
Очікується: `pass 2`, `fail 0`, exit 0

- [ ] **Крок 5: Коміт**

```bash
git add src/lib/chat-store.ts src/lib/chat-store.test.ts
git commit -m "feat: сховище історії чату в D1"
```

---

### Task 3: Ліміти запитів

**Файли:**
- Створити: `src/lib/chat-limits.ts`
- Створити: `src/lib/chat-limits.test.ts`

**Інтерфейси:**
- Споживає: `d1` з `src/lib/chat-store.ts`.
- Продукує:
  - `const LIMITS = { perSession: 40, perIpPerHour: 60, maxMessageChars: 2000, historyDepth: 20 }`
  - `function validateMessage(text: unknown): { ok: true; text: string } | { ok: false; reason: string }`
  - `async function checkLimits(sessionId: string, ipHash: string): Promise<{ ok: boolean; retryAfter?: number }>`

Лічильники беруться з уже наявних таблиць — окремого сховища лімітів не заводимо.

- [ ] **Крок 1: Написати падаючий тест**

`src/lib/chat-limits.test.ts`:

```typescript
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
```

- [ ] **Крок 2: Запустити тест — має впасти**

Run: `node --test src/lib/chat-limits.test.ts`
Очікується: FAIL, `Cannot find module './chat-limits.ts'`

- [ ] **Крок 3: Мінімальна реалізація**

`src/lib/chat-limits.ts`:

```typescript
/**
 * Ліміти для /api/chat.
 *
 * Ендпоінт публічний і ходить у платну модель — без обмежень це відкритий гаманець.
 * Лічильники читаємо з наявних таблиць чату: окреме сховище лімітів було б третьою
 * копією тих самих даних.
 */
import { d1 } from './chat-store'

export const LIMITS = {
  perSession: 40,
  perIpPerHour: 60,
  maxMessageChars: 2000,
  historyDepth: 20,
} as const

export function validateMessage(text: unknown): { ok: true; text: string } | { ok: false; reason: string } {
  if (typeof text !== 'string') return { ok: false, reason: 'not_a_string' }
  const trimmed = text.trim()
  if (!trimmed) return { ok: false, reason: 'empty' }
  if (trimmed.length > LIMITS.maxMessageChars) return { ok: false, reason: 'too_long' }
  return { ok: true, text: trimmed }
}

export async function checkLimits(sessionId: string, ipHash: string): Promise<{ ok: boolean; retryAfter?: number }> {
  const [sess] = await d1(
    "SELECT COUNT(*) AS n FROM chat_messages WHERE session_id = ? AND role = 'user'",
    [sessionId],
  )
  if (Number(sess?.n ?? 0) >= LIMITS.perSession) return { ok: false, retryAfter: 3600 }

  const [ip] = await d1(
    `SELECT COUNT(*) AS n FROM chat_messages m
     JOIN chat_sessions s ON s.id = m.session_id
     WHERE s.ip_hash = ? AND m.created_at > strftime('%Y-%m-%dT%H:%M:%SZ','now','-1 hour')`,
    [ipHash],
  )
  if (Number(ip?.n ?? 0) >= LIMITS.perIpPerHour) return { ok: false, retryAfter: 3600 }

  return { ok: true }
}
```

- [ ] **Крок 4: Запустити тест — має пройти**

Run: `node --test src/lib/chat-limits.test.ts`
Очікується: `pass 3`, `fail 0`

- [ ] **Крок 5: Коміт**

```bash
git add src/lib/chat-limits.ts src/lib/chat-limits.test.ts
git commit -m "feat: ліміти запитів до чату"
```

---

### Task 4: Системний промпт і опис інструмента

**Файли:**
- Створити: `src/lib/chat-prompt.ts`
- Створити: `src/lib/chat-prompt.test.ts`
- Читати: `docs/ai-agent/builder-prompt.md`

**Інтерфейси:**
- Продукує:
  - `const SYSTEM_INSTRUCTION: string`
  - `const SUBMIT_LEAD_TOOL` — опис інструмента у форматі OpenAI (Gateway OpenAI-сумісний; Gemini-формат із експорту Agent Studio тут НЕ підходить, перевірено).
  - `type LeadArgs = { name: string; phone: string; message?: string; url?: string }`
  - `function parseLeadArgs(raw: string): LeadArgs | null`

- [ ] **Крок 1: Написати падаючий тест**

`src/lib/chat-prompt.test.ts`:

```typescript
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
```

- [ ] **Крок 2: Запустити тест — має впасти**

Run: `node --test src/lib/chat-prompt.test.ts`
Очікується: FAIL, `Cannot find module './chat-prompt.ts'`

- [ ] **Крок 3: Реалізація**

`src/lib/chat-prompt.ts`. Значення `SYSTEM_INSTRUCTION` — це вміст
`docs/ai-agent/builder-prompt.md` починаючи з рядка `## РОЛЬ` і до кінця файлу,
як звичайний рядковий літерал (backtick-рядок; зворотні лапки всередині екранувати).
Вступний абзац «Заміни системну інструкцію в …» НЕ включати — він адресований білдеру Google,
а не моделі.

**Промпт живе на сервері.** У згенерованому Agent Studio коді він лежав у фронтенд-бандлі —
разом із ним у браузер їхав і доступ до моделі. Цей файл імпортується ТІЛЬКИ з `route.ts`.

```typescript
export type LeadArgs = { name: string; phone: string; message?: string; url?: string }

export const SYSTEM_INSTRUCTION = `## РОЛЬ
... (повний текст із docs/ai-agent/builder-prompt.md) ...`

export const SUBMIT_LEAD_TOOL = {
  type: 'function' as const,
  function: {
    name: 'submit_lead',
    description: 'Відправити контактні дані потенційного клієнта команді Neuronix',
    parameters: {
      type: 'object',
      properties: {
        name: { type: 'string', description: "Ім'я клієнта" },
        phone: { type: 'string', description: 'Телефон, email або нік у Telegram' },
        message: { type: 'string', description: 'Короткий опис задачі' },
        url: { type: 'string', description: 'Сайт клієнта, якщо є' },
      },
      required: ['name', 'phone'],
    },
  },
}

/** Аргументи від моделі — це дані, а не команда. Валідуємо перед тим, як створювати лід. */
export function parseLeadArgs(raw: string): LeadArgs | null {
  let parsed: unknown
  try {
    parsed = JSON.parse(raw)
  } catch {
    return null
  }
  if (typeof parsed !== 'object' || parsed === null) return null
  const o = parsed as Record<string, unknown>
  const name = typeof o.name === 'string' ? o.name.trim() : ''
  const phone = typeof o.phone === 'string' ? o.phone.trim() : ''
  if (!name || !phone) return null
  return {
    name: name.slice(0, 200),
    phone: phone.slice(0, 200),
    message: typeof o.message === 'string' ? o.message.slice(0, 2000) : undefined,
    url: typeof o.url === 'string' ? o.url.slice(0, 500) : undefined,
  }
}
```

- [ ] **Крок 4: Запустити тест — має пройти**

Run: `node --test src/lib/chat-prompt.test.ts`
Очікується: `pass 3`, `fail 0`

- [ ] **Крок 5: Звірити промпт із сайтом**

Run: `python3 docs/ai-agent/check-prompt-facts.py`
Очікується: `OK — промпт збігається з uk.json`

- [ ] **Крок 6: Коміт**

```bash
git add src/lib/chat-prompt.ts src/lib/chat-prompt.test.ts
git commit -m "feat: системний промпт чату на сервері"
```

---

### Task 5: Роут `/api/chat`

**Файли:**
- Створити: `src/app/api/chat/route.ts`
- Змінити: `src/lib/leads.ts` — додати `'chat'` у `LeadSource` і повертати `id` створеного ліда
- Створити: `src/lib/lead-notify.ts` — `sendTelegram`/`sendEmail`, винесені з `api/contact`
- Змінити: `.env.example` — додати `AI_GATEWAY_API_KEY`, `CHAT_IP_SALT`

**Інтерфейси:**
- Споживає: `chat-store`, `chat-limits`, `chat-prompt`, `saveLead`.
- Продукує: `POST /api/chat` за контрактом зі спеки §4.

- [ ] **Крок 1: Розширити `saveLead`**

У `src/lib/leads.ts`: тип стає
`type LeadSource = 'form' | 'audit' | 'telegram' | 'telegram_start' | 'chat'`,
а `saveLead` повертає `Promise<number | null>` — id рядка (`last_row_id` з відповіді D1)
замість `boolean`. Виклики в `api/contact` і `api/telegram` перевіряють результат
на істинність, тому лишаються робочими без правок.

- [ ] **Крок 2: Написати роут**

`src/app/api/chat/route.ts`:

```typescript
import { NextRequest, NextResponse } from 'next/server'
import { LIMITS, checkLimits, validateMessage } from '@/lib/chat-limits'
import { SUBMIT_LEAD_TOOL, SYSTEM_INSTRUCTION, parseLeadArgs } from '@/lib/chat-prompt'
import { appendMessage, getHistory, hashIp, linkLead, touchSession, trimHistory } from '@/lib/chat-store'
import { saveLead } from '@/lib/leads'

const GATEWAY = 'https://ai-gateway.vercel.sh/v1/chat/completions'
const MODEL = 'google/gemini-2.5-flash'
const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i

const tg = 'https://t.me/neuronixjhbot'
const fallback = (locale?: string) =>
  locale === 'en'
    ? `Sorry — I can't reply right now. Please message us directly: ${tg}`
    : `Вибачте, зараз не можу відповісти. Напишіть, будь ласка, напряму: ${tg}`

export async function POST(req: NextRequest) {
  try {
    const { sessionId, message, locale, landingPath, distinctId, utm } = await req.json()
    if (!UUID.test(String(sessionId ?? ''))) {
      return NextResponse.json({ error: 'bad_session' }, { status: 400 })
    }
    const valid = validateMessage(message)
    if (!valid.ok) return NextResponse.json({ error: valid.reason }, { status: 400 })

    const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown'
    const ipHash = hashIp(ip, process.env.CHAT_IP_SALT ?? 'neuronix')

    const limit = await checkLimits(sessionId, ipHash)
    if (!limit.ok) {
      return NextResponse.json({ error: 'rate_limited', retryAfter: limit.retryAfter }, { status: 429 })
    }

    await touchSession(sessionId, { locale, landingPath, distinctId, ipHash, utm })
    const history = trimHistory(await getHistory(sessionId, LIMITS.historyDepth), LIMITS.historyDepth)
    await appendMessage(sessionId, { role: 'user', content: valid.text })

    const key = process.env.AI_GATEWAY_API_KEY
    if (!key) return NextResponse.json({ reply: fallback(locale) }, { status: 503 })

    const messages = [
      { role: 'system', content: SYSTEM_INSTRUCTION },
      // tool-повідомлення лишаються в D1 для аудиту, але в модель не йдуть:
      // службовий JSON виклику інструмента як репліка користувача — це сміття в контексті.
      ...history
        .filter((m) => m.role !== 'tool')
        .map((m) => ({ role: m.role === 'model' ? 'assistant' : 'user', content: m.content })),
      { role: 'user', content: valid.text },
    ]

    const ai = await fetch(GATEWAY, {
      method: 'POST',
      headers: { Authorization: `Bearer ${key}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ model: MODEL, messages, temperature: 0.2, max_tokens: 1200, tools: [SUBMIT_LEAD_TOOL] }),
    })
    if (!ai.ok) {
      console.error('Gateway error:', ai.status, await ai.text())
      return NextResponse.json({ reply: fallback(locale) }, { status: 503 })
    }

    const data = await ai.json()
    const choice = data?.choices?.[0]?.message
    let leadCreated = false

    // Інструмент виконує СЕРВЕР. У згенерованому коді це робив браузер — тоді заявку
    // можна підробити запитом повз чат, а source 'chat' нічого не вартий.
    const call = choice?.tool_calls?.[0]
    if (call?.function?.name === 'submit_lead') {
      const args = parseLeadArgs(call.function.arguments ?? '')
      if (args) {
        const leadId = await saveLead({
          source: 'chat', name: args.name, contact: args.phone,
          message: args.message, siteUrl: args.url,
        })
        if (leadId) await linkLead(sessionId, leadId)
        leadCreated = Boolean(leadId)
        await appendMessage(sessionId, { role: 'tool', content: JSON.stringify(args), toolName: 'submit_lead' })
      }
    }

    const reply = String(choice?.content ?? '').trim() || fallback(locale)
    await appendMessage(sessionId, { role: 'model', content: reply })
    return NextResponse.json({ reply, leadCreated })
  } catch (e) {
    console.error('Chat route error:', e)
    return NextResponse.json({ reply: fallback() }, { status: 503 })
  }
}
```

⚠️ **Заявка мусить дійти до людини так само, як із форми.** Якщо `saveLead` — єдиний канал,
лід зберігається, але ніхто про нього не дізнається. Перед завершенням задачі винести
`sendTelegram` і `sendEmail` із `src/app/api/contact/route.ts` у `src/lib/lead-notify.ts`
і викликати їх тут поруч із `saveLead`. Це та сама вимога, що в `api/contact`:
сховище — не канал доставки.

- [ ] **Крок 3: Перевірити типи**

Run: `npx tsc --noEmit`
Очікується: без помилок.

- [ ] **Крок 4: Локальний прогін**

```bash
npm run dev
# в іншому терміналі:
curl -s localhost:3000/api/chat -H 'Content-Type: application/json' \
  -d '{"sessionId":"11111111-2222-4333-8444-555555555555","message":"Скільки коштує лендінг?","locale":"uk"}' | head -c 400
```

Очікується: JSON із `reply`, у якому фігурує `$350`.

Перевірка захисту:

```bash
curl -s -o /dev/null -w '%{http_code}\n' localhost:3000/api/chat -H 'Content-Type: application/json' -d '{"sessionId":"не-uuid","message":"привіт"}'   # 400
curl -s -o /dev/null -w '%{http_code}\n' localhost:3000/api/chat -H 'Content-Type: application/json' -d '{"sessionId":"11111111-2222-4333-8444-555555555555","message":""}'  # 400
```

- [ ] **Крок 5: Коміт**

```bash
git add src/app/api/chat/route.ts src/lib/leads.ts src/lib/lead-notify.ts .env.example
git commit -m "feat: роут /api/chat з серверним виконанням submit_lead"
```

---

### Task 6: Віджет чату

**Файли:**
- Створити: `src/components/ChatWidget.tsx`
- Створити: `src/components/css/ChatWidget.css`
- Змінити: `src/app/[locale]/layout.tsx` — підключити віджет
- Змінити: `src/i18n/uk.json` + `src/i18n/en.json` — namespace `chat`

**Інтерфейси:**
- Споживає: `POST /api/chat`.
- Продукує: плаваючу кнопку + панель діалогу на всіх сторінках.

- [ ] **Крок 1: Рядки інтерфейсу в i18n**

Додати **дзеркально** в обидва файли namespace `chat`:
`open`, `title`, `subtitle`, `placeholder`, `send`, `thinking`, `error`, `leadOk`,
`telegramFallback`, `close`. Хардкоду української в компоненті не лишати.

- [ ] **Крок 2: Компонент**

`ChatWidget.tsx` — клієнтський (`'use client'`). Вимоги:

- `sessionId` — `crypto.randomUUID()`, зберігається в `localStorage` під ключем `chat_session_id`; читання й запис у `try/catch` (приватний режим кидає виняток).
- `distinctId` береться як `window.posthog?.get_distinct_id?.()` в момент відправки, не при монтуванні: PostHog вантажиться пізніше.
- `landingPath` — `window.location.pathname`.
- `utm` — з `new URLSearchParams(window.location.search)`.
- Помилка або 429 → показати повідомлення з посиланням на `t.me/neuronixjhbot`. **Не мовчати і не писати «щось пішло не так»**: втратити ліда через технічний збій гірше, ніж визнати збій.
- Панель — `position: fixed`, **без `backdrop-filter`** (ламає iOS при зупинці інерції скролу, коміт `386d95d`).
- Автоскрол списку повідомлень — усередині власного контейнера панелі, не через `window`.

- [ ] **Крок 3: Стилі**

`src/components/css/ChatWidget.css`, змінні з `src/styles/variables.css`.
Мобільний: панель на всю ширину, `max-height: 80dvh`. **Фіксована висота області
повідомлень, не `min-height`** — анімації, що накопичують контент, штовхають сторінку
(урок `AnimatedTerminal`, замір: стрибок 65px на 390px).

- [ ] **Крок 4: Підключити в layout**

Додати `<ChatWidget />` у `src/app/[locale]/layout.tsx` поруч зі `StickyCta`.

- [ ] **Крок 5: Перевірити типи й білд**

Run: `npx tsc --noEmit && npm run build`
Очікується: без помилок; сторінки лишаються статичними (`●`, не `ƒ`) — віджет клієнтський і SSG не ламає.

- [ ] **Крок 6: Коміт**

```bash
git add src/components/ChatWidget.tsx src/components/css/ChatWidget.css src/app/\[locale\]/layout.tsx src/i18n
git commit -m "feat: віджет чату"
```

---

### Task 7: Конверсії та аналітика

**Файли:**
- Змінити: `src/components/ChatWidget.tsx`
- Змінити: `src/lib/analytics.ts` (за потреби — коментар про нові події)

- [ ] **Крок 1: Події PostHog**

У віджеті через наявний `track()`:
`chat_opened`, `chat_message_sent`, `chat_error` (з `reason`), `chat_lead_submitted`.

- [ ] **Крок 2: Конверсія в Ads**

При `leadCreated === true`:

```typescript
sendGTMEvent({ event: 'generate_lead', lead_source: 'chat' })
try { window.posthog?.identify?.(contactValue) } catch {}
track('chat_lead_submitted')
```

**Та сама подія `generate_lead`, що й форма** — свідомо. Це та сама бізнес-подія;
окрема конверсійна дія роздробила б навчання Ads. Джерело розрізняється параметром.

⚠️ Порядок обов'язковий: спершу `sendGTMEvent`, потім `track()` у `try/catch`.
Збій аналітики не має права завадити конверсії дійти до Google Ads.

- [ ] **Крок 3: Перевірка**

Прогнати діалог до заявки на прод-домені → GA4 Realtime має показати `generate_lead`
з параметром `lead_source: chat`; PostHog Live Events — `chat_lead_submitted`.

- [ ] **Крок 4: Коміт**

```bash
git add src/components/ChatWidget.tsx src/lib/analytics.ts
git commit -m "feat: конверсії та події чату"
```

---

### Task 8: Політика конфіденційності

**Файли:**
- Змінити: `src/app/[locale]/privacy-policy/page.tsx`
- Змінити: `src/i18n/uk.json` + `src/i18n/en.json` (якщо текст політики там)

- [ ] **Крок 1: Дописати розділ про чат**

**Обома мовами.** Вказати: зберігаємо переписку з чат-агентом; мета — обробка звернення
й покращення сервісу; що саме зберігається (текст повідомлень, час, сторінка входу,
ідентифікатор сесії); строк зберігання; зв'язок із PostHog.

Прецедент, через який це в плані окремою задачею: 25.08 вмикали записи сесій, а політика
прямо декларувала «записи вимкнені» — довелось правити заднім числом обома мовами.

- [ ] **Крок 2: Перевірити, що обидві мови змінені**

```bash
git diff --stat src/app/\[locale\]/privacy-policy/ src/i18n/
```
Очікується: зміни і в `uk`, і в `en`.

- [ ] **Крок 3: Коміт**

```bash
git add src/app/\[locale\]/privacy-policy src/i18n
git commit -m "docs: політика — зберігання діалогів чату"
```

---

### Task 9: Наскрізна перевірка й документація

- [ ] **Крок 1: Усі тести**

```bash
node --test src/lib/*.test.ts
python3 docs/ai-agent/check-prompt-facts.py
python3 docs/ai-agent/test-prompt-behaviour.py
npx tsc --noEmit
npm run build
```
Очікується: усе зелене, exit 0.

- [ ] **Крок 2: Env у Vercel Production**

`AI_GATEWAY_API_KEY` (Vault `shared/vercel_ai_gateway_key`), `CHAT_IP_SALT` (випадковий рядок).
⚠️ Змінна застосовується лише після НОВОГО білда — сам по собі `env add` нічого не змінює.

- [ ] **Крок 3: Живий діалог із заявкою**

Пройти діалог на проді до створення заявки. Перевірити перечитуванням:

```sql
SELECT s.id, s.lead_id, l.source, l.name, COUNT(m.id) AS msgs
FROM chat_sessions s
LEFT JOIN leads l ON l.id = s.lead_id
LEFT JOIN chat_messages m ON m.session_id = s.id
GROUP BY s.id ORDER BY s.created_at DESC LIMIT 5;
```

Очікується: рядок із `source='chat'`, ненульовим `lead_id` і кількістю повідомлень > 0.
Заявка має прийти в Telegram і на пошту — так само, як із форми.

- [ ] **Крок 4: Діалог без заявки**

Поставити питання й піти. Перевірити: сесія і повідомлення в D1 є, `lead_id` порожній.

- [ ] **Крок 5: Оновити `CLAUDE.md`**

Додати розділ про чат-агента: архітектура, де живе промпт, як оновлювати (правити
`docs/ai-agent/builder-prompt.md` → синхронізувати `src/lib/chat-prompt.ts` → прогнати
обидві перевірки), ліміти, таблиці D1. Це вимога правила 15 `/root/CLAUDE.md` —
документація оновлюється в тій самій задачі.

- [ ] **Крок 6: Фінальний стан репозиторію**

```bash
git status --porcelain          # має бути порожньо
git rev-list --left-right --count origin/main...HEAD   # має бути "0	0"
```

---

## Відкрите (не блокує)

- Стрімінг відповіді — окрема ітерація, якщо затримка заважатиме.
- Адмін-перегляд діалогів — поки достатньо SQL-запиту.
- Другий агент (`BeSport Консультант` у Google-білдері) — окрема задача.
