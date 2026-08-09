# Neuronix Landing — TODO
> last_updated: 2026-08-09

## Правила оновлення
- Атомарні задачі (одна дія). Часто декомпозиція поточної фази PLAN.md.
- Статус міняється В ТІЙ САМІЙ задачі; зроблено → ✅ + дата.
- «Зроблено» періодично зливаємо в notes.md.
- Статуси: 🔲 · 🟡 · ✅ · 🔴.

## Зараз
- 🔲 **Андрію (в GSC, не код):** перевірити що sitemap.xml поданий у Search Console;
  зробити Request Indexing для /uk, /uk/ai, /uk/opencart, /uk/horoshop, /uk/keycrm
- 🔲 Замінити заглушкові імена команди (Олег/Марта → реальні люди або прибрати поле `name`)
  в `src/i18n/uk.json` + `en.json`, секція `team.members`. Деталі: CLAUDE.md → «Відкритий борг».

## Беклог
- 🔲 Квіз-калькулятор «скільки втрачаєте без автоматизації» на /ai (відкладено 2026-08-09)
- 🔲 Підтвердити в Андрія ціну голосових AI-агентів (на /ai зараз «розрахунок після аудиту»)
- 🔲 Кнопка «Дізнатись більше» в Services.tsx захардкоджена укр. мовою — на /en показує укр.

## Зроблено (чистити → notes.md)
- ✅ 2026-08-09: Англійський блог: 14 статей перекладено (`src/content/blog/en/`), блог
  локалізовано (locale-aware API, UI-рядки в i18n, hreflang, sitemap 25→40 URL),
  редіректи /en/blog прибрано
- ✅ 2026-08-09: GSC-аудит: корінь 307→308 (постійний), x-default hreflang скрізь
  (HTML + sitemap). Деталі: CLAUDE.md → «Індексація і hreflang»
- ✅ 2026-08-09: Платформені сторінки /opencart /horoshop /keycrm (uk+en) за інтент-дослідженням:
  спільний шаблон [platform], оффер «контент-система 24/7», футер-перелінковка, sitemap.
  Дослідження: docs/keyword-research-2026-08.md, ітерація 2
- ✅ 2026-08-09: Дослідження пошукових запитів UA (Keyword Planner) + сторінка /ai під AI-оффери:
  i18n `ai.*`, реюз Pains/Services/FAQ через namespace, AiHero/AiStats/AiSecurity, nav, sitemap,
  картка AI на головній. Доки: docs/keyword-research-2026-08.md
- ✅ 2026-08-06: Фікс ривків скролу Hero (`AnimatedTerminal` `min-height` → `height`)
- ✅ 2026-08-05: Clarity consent v2, GTM, дублі блогу, og:image, sitemap
- ✅ 2026-08-04: Конверсійний редизайн головної під дані попиту
