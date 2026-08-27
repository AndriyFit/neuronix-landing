# Експорт з Agent Studio App builder — довідковий код

Вивантажено 2026-08-27 з проєкту `Neuronix Consultant`
(GCP `steady-tape-453013-p6`, agent id `6022337446631440384`) кнопкою download code.

**Це довідник, а не робочий модуль сайту.** Ніщо звідси не збирається і не деплоїться
разом із neuronix-landing. Живий агент поки живе в консолі Google.

## Що всередині

| | |
|---|---|
| `frontend/services/geminiService.ts` | **головне.** `SYSTEM_INSTRUCTION` — наш промпт із `../builder-prompt.md`, плюс `submitLeadDeclaration` (function calling) |
| `frontend/App.tsx`, `components/` | UI чату (React + Vite, НЕ наш стек) |
| `backend/server.js` | Express-проксі до Vertex AI через `google-auth-library` (ADC) |
| `frontend/vertex-ai-proxy-interceptor.js` | перехоплює виклики SDK і шле їх на бек |

Модель `gemini-2.5-flash`, `temperature: 0.2`.

## Що НЕ скопійовано

`backend/.env.local` — містить `PROXY_HEADER` (спільний секрет фронт↔бек). Ключів Google
там немає: бек автентифікується через ADC. Файл лишився лише в оригінальному zip.

## Дві речі, які вирішують спосіб інтеграції

1. **`fetch('/api/contact')` — відносний шлях.** Автономно (у прев'ю чи на окремому хості)
   він дає 404, бо такого роуту там немає. Усередині neuronix-landing він резолвиться в
   `neuronics.work/api/contact` — same-origin, наявний лід-пайплайн (D1 + Telegram + Gmail),
   і CORS не потрібен. Це головний аргумент за перенесення віджета в сайт.

2. **ADC на Vercel не існує.** `backend/server.js` покладається на
   `gcloud auth application-default login` — локальна історія. У проді потрібен інший
   принципал: сервісний акаунт або API-ключ, прив'язаний до сервісного акаунта
   (`.knowledge/infra/mcp.md` описує ту саму розвилку). Це рішення, а не механічний порт.

## Чого тут свідомо немає

Стек не збігається з сайтом: тут Vite + власний CSS-in-JSX, у нас Next.js 16 App Router
і по одному CSS-файлу на компонент (`src/components/css/`). Прямий копіпаст порушив би
конвенцію репозиторію. При інтеграції з цього беруться `SYSTEM_INSTRUCTION` і
`submitLeadDeclaration`, а UI пишеться під наш стек.

## Зв'язані

- `../builder-prompt.md` — джерело промпту
- `../check-prompt-facts.py` — звірка цін і статей з `src/i18n/uk.json`
- `../test-prompt-behaviour.py` — 13 пасток проти живої моделі
