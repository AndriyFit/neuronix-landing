# Neuronix Landing — джерело правди для агента

Сайт агенції Neuronix. Прод: **neuronics.work** (Vercel). Репо: `AndriyFit/neuronix-landing`.

## Стек

Next.js 16 (App Router) · TypeScript · next-intl (uk/en) · React 19 · react-hook-form.
**Без Tailwind і без UI-бібліотек** — по одному CSS-файлу на компонент у `src/components/css/`.
Змінні теми — `src/styles/variables.css`, глобальні стилі — `src/styles/global.css`.

## Деплой

**Тільки `git push`.** Vercel деплоїть з `main` автоматично. `vercel deploy` з локалки — заборонено
(деплоїть диск, а не коміт; прод перестає відповідати git-стану).
Гілка → push → preview URL → мердж у `main` → прод.

## Архітектура контенту (головне)

**Увесь текст сайту живе в `src/i18n/uk.json` + `en.json`.** Компоненти читають через
`useTranslations` / `t.raw('items')`. Файли дзеркальні за структурою.

Наслідок: **зміна текстів, цін, послуг, FAQ не потребує правки коду.** Додати послугу = додати
обʼєкт у `services.items`. Змінити ціни = `pricing.items`. Перед правкою компонента спитай себе,
чи це не просто json.

Метадані сторінки (title/description) — теж у json, секція `metadata`, збираються в `src/lib/metadata.ts`.
Структуровані дані (schema.org) генеруються з тих самих json у `src/lib/structured-data.ts` —
**якщо міняєш `services.items` чи `faq.items`, schema оновлюється сама**, чіпати не треба.

## Пастки, на які вже наступали

### Скрол іде не в `document`, а в `#page-scroll`
Сторінка скролиться у власному контейнері (`src/app/[locale]/layout.tsx`) — це частина фіксу
стрибків на iOS. Наслідки:
- `IntersectionObserver` має отримувати `{ root: document.getElementById('page-scroll') }`,
  інакше нічого не спрацює. Готовий хук: `src/lib/useScrollReveal.ts`.
- Слухати скрол треба на цьому елементі, не на `window`.
- Playwright `fullPage: true` знімає лише перший екран — для скріншотів тимчасово
  задай контейнеру `overflow: visible; height: auto`.

### `backdrop-filter` на `position: fixed` ламає iOS
Коміт `386d95d`: iOS Safari перемальовує такі елементи, коли зупиняється інерція скролу —
виглядає як стрибок сторінки. Navbar тому скидає блюр під 900px, `StickyCta` навмисно
має суцільний фон. **Не додавай блюр на фіксовані елементи.**

### `h2` — `inline-block`
`global.css`: `h2 { display: inline-block }` + `h2::after` (акцентна риска 60px, центрована
всередині заголовка). Тому `text-align: center` на самому заголовку **нічого не робить** —
центрує лише текст усередині коробки, що дорівнює ширині тексту.
Заголовки секцій на лендінгу вирівняні **ліворуч** — це наявна мова дизайну, не баг.
Блог покладається на той самий `h2`, тому глобальне правило міняти не можна.

### Мобільні scroll-reveal
`global.css` під 768px скидає `transform` на `.animate-in` — інакше картки видимо
підстрибують при спрацюванні обсервера. Нові анімовані елементи мають нести клас
`.animate-in`, тоді вони покриті автоматично. Власні `opacity/transform` у CSS секції
не дублюй — це вже є глобально.

### `next-env.d.ts`
Генерований файл, що перемикається між `.next/types/` і `.next/dev/types/` залежно від
того, що запускали останнім — `build` чи `dev`. Постійно спливає в `git status`.
Не комітити dev-варіант, відкочувати: `git checkout -- next-env.d.ts`.

## Аналітика

**Microsoft Clarity** — `src/components/Clarity.tsx`, вмикається змінною `NEXT_PUBLIC_CLARITY_ID`
у Vercel. Порожня змінна = скрипт не вантажиться взагалі.

⚠️ **Два різні ID, які легко переплутати:**

| Що | Вигляд | Де взяти | Навіщо |
|---|---|---|---|
| Tracking ID | 10 символів (`3t0wlogvdz`) | URL дашборда `clarity.microsoft.com/projects/view/<ID>/dashboard` | `NEXT_PUBLIC_CLARITY_ID` для снипета |
| `sub` з Data Export JWT | 16 цифр | payload токена | внутрішній id акаунта, **для снипета не годиться** |

Data Export API не приймає id проєкту — проєкт визначає сам токен. Тому tracking ID через API
не дізнатись, тільки з дашборда.

Наш tracking ID — **`xx4u0gbnw4`** (не секрет, видно у вихідному коді сторінки).
Дашборд: `clarity.microsoft.com/projects/view/xx4u0gbnw4`.
Заведено у Vercel як `NEXT_PUBLIC_CLARITY_ID` для Production і Preview.

Vault: `neuronix/clarity_tracking_id`, `neuronix/clarity_data_export_token`
(API, ліміт 10 запитів/добу, дані за 1–3 дні), `neuronix/clarity_project_sub`.

**Чому скрипт не в `<head>`, хоча Clarity так радить:** використовуємо `next/script` зі
стратегією `afterInteractive` — вантажиться після гідратації, не блокує перший рендер.
Швидкість мобільної сторінки впливає і на конверсію, і на Quality Score у Google Ads, тому
блокувати рендер заради кількох сотень мілісекунд раннього трекінгу невигідно. Офіційний
пакет `@microsoft/clarity` для React ініціалізується ще пізніше (в `useEffect`), тож наш
варіант навіть агресивніший. Перевірено: `clarity.ms/tag/xx4u0gbnw4` → 200,
`r.clarity.ms/collect` → 204.

**Google Search Console** — верифікація в `src/lib/metadata.ts` + `public/google*.html`.

## Позиціонування (не «веб-студія»)

Neuronix продає **системи, а не сайти**: сайт + автоматизація + інтеграції, де магазин, CRM,
1С, маркетплейси, телефонія й доставка обмінюються даними. Сайт — одна з частин контуру.

Правила копірайту:
- У заголовках — те, що **гуглять** (розробка сайтів, інтернет-магазин). Не «AI-автоматизація»:
  попиту на неї в пошуку практично немає (див. `docs/2026-08-04-demand-research.md`).
- Ніде не писати Vapi, n8n, LLM, webhook — це наша кухня, клієнт купує результат.
- Ціни — відкриті, у гривнях. 9 з 12 конкурентів їх ховають, це наша перевага.
- **SEO/просування не продаємо** — не наша спеціалізація, з сайту прибрано свідомо.

## Доки

- `docs/2026-08-04-demand-research.md` — дослідження попиту (Keyword Planner, цифри по ринку)
- `docs/2026-08-04-conversion-blueprint.md` — структура сторінки й тексти по секціях
- `docs/superpowers/` — попередні спеки й плани (SEO-міграція, редизайн 05.2026)
