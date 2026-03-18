# SEO & AI Visibility: Next.js Migration — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Migrate Neuronix AI landing from Vite SPA to Next.js 15 with SSG, bilingual i18n (uk/en), structured data, and AI crawler optimization for maximum organic traffic and AI model visibility.

**Architecture:** Next.js 15 App Router with `[locale]` dynamic segment. Static generation at build time for both locales. `next-intl` for i18n. All existing React components migrated as Client Components, new SEO-critical components (FAQ, Footer) as Server Components. JSON-LD structured data embedded in layout.

**Tech Stack:** Next.js 15, React 19, TypeScript, next-intl v4, GSAP, react-hook-form, Vercel

**Spec:** `docs/superpowers/specs/2026-03-18-seo-ai-visibility-design.md`

---

## File Structure

```
src/
  app/
    layout.tsx                    # Root layout: fonts, global CSS imports
    [locale]/
      layout.tsx                  # Locale layout: metadata, JSON-LD, Navbar, Footer, generateStaticParams
      page.tsx                    # Main page: all sections composed
      not-found.tsx               # 404 per locale
    sitemap.ts                    # Auto-generated sitemap for both locales
    robots.ts                     # robots.txt with AI bot rules
  components/
    Navbar.tsx                    # Client — migrated, + LanguageSwitcher
    LanguageSwitcher.tsx          # Client — new, uk/en toggle
    Hero.tsx                      # Client — migrated
    VideoBackground.tsx           # Client — new, extracted from App.tsx
    Services.tsx                  # Client — migrated
    Cases.tsx                     # Client — migrated
    About.tsx                     # Client — migrated
    Testimonials.tsx              # Client — migrated
    FAQ.tsx                       # Server — new
    Contact.tsx                   # Client — migrated, footer extracted
    Footer.tsx                    # Server — new, extracted from Contact
  components/css/                 # All CSS files moved here
    Navbar.css
    Hero.css
    Services.css
    Cases.css
    About.css
    Testimonials.css
    Contact.css
    Footer.css
    FAQ.css
  styles/
    variables.css                 # Keep as-is
    global.css                    # Keep as-is
    sections-video.css            # Keep as-is
  i18n/
    config.ts                     # Locale list, default locale
    routing.ts                    # next-intl v4 routing definition
    navigation.ts                 # Locale-aware Link, useRouter, usePathname
    request.ts                    # next-intl server request config
    uk.json                       # All Ukrainian texts
    en.json                       # All English texts
  lib/
    metadata.ts                   # generateMetadata factory per locale
    structured-data.ts            # JSON-LD schema generators
  middleware.ts                   # Locale detection & redirect
next.config.ts                    # next-intl plugin config
.env.local                        # NEXT_PUBLIC_WEBHOOK_URL, NEXT_PUBLIC_SITE_URL
```

---

## Task 1: Initialize Next.js project & dependencies

**Files:**
- Modify: `package.json`
- Create: `next.config.ts`
- Create: `.env.local`
- Remove: `vite.config.ts`, `tsconfig.node.json`, `eslint.config.js`
- Modify: `tsconfig.json`, `tsconfig.app.json`
- Modify: `index.html` → remove (Next.js manages HTML)

- [ ] **Step 1: Install Next.js and next-intl, remove Vite deps**

```bash
cd /root/projects/neuronix-landing
npm install next next-intl
npm uninstall vite @vitejs/plugin-react eslint-plugin-react-refresh @types/three
npm install -D eslint-config-next
```

- [ ] **Step 2: Create `next.config.ts`**

```ts
// next.config.ts
import createNextIntlPlugin from 'next-intl/plugin'

const withNextIntl = createNextIntlPlugin('./src/i18n/request.ts')

const nextConfig = {
  // Vercel default output — compatible with middleware
}

export default withNextIntl(nextConfig)
```

- [ ] **Step 3: Create `.env.local`**

```bash
NEXT_PUBLIC_WEBHOOK_URL=https://primary-7jgw-n8n.up.railway.app/webhook/neuronix_lead
NEXT_PUBLIC_SITE_URL=https://neuronix.work
```

- [ ] **Step 4: Update `tsconfig.json` for Next.js**

Replace contents with:
```json
{
  "compilerOptions": {
    "target": "ES2017",
    "lib": ["dom", "dom.iterable", "esnext"],
    "allowJs": true,
    "skipLibCheck": true,
    "strict": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "incremental": true,
    "plugins": [{ "name": "next" }],
    "paths": { "@/*": ["./src/*"] }
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
  "exclude": ["node_modules"]
}
```

- [ ] **Step 5: Update `package.json` scripts**

Replace scripts section:
```json
{
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint"
  }
}
```

- [ ] **Step 6: Remove old config files**

```bash
rm vite.config.ts tsconfig.node.json tsconfig.app.json eslint.config.js index.html
```

- [ ] **Step 7: Move CSS files to components/css/**

```bash
mkdir -p src/components/css
mv src/components/*.css src/components/css/
```

- [ ] **Step 8: Commit**

```bash
git add -A
git commit -m "chore: initialize Next.js 15, remove Vite, update tsconfig"
```

---

## Task 2: Set up i18n with next-intl

**Files:**
- Create: `src/i18n/config.ts`
- Create: `src/i18n/request.ts`
- Create: `src/i18n/uk.json`
- Create: `src/i18n/en.json`
- Create: `src/middleware.ts`

- [ ] **Step 1: Create `src/i18n/config.ts`**

```ts
export const locales = ['uk', 'en'] as const
export type Locale = (typeof locales)[number]
export const defaultLocale: Locale = 'uk'
```

- [ ] **Step 2: Create `src/i18n/routing.ts`**

```ts
import { defineRouting } from 'next-intl/routing'
import { locales, defaultLocale } from './config'

export const routing = defineRouting({
  locales,
  defaultLocale,
  localePrefix: 'always',
})
```

- [ ] **Step 3: Create `src/i18n/navigation.ts`**

```ts
import { createNavigation } from 'next-intl/navigation'
import { routing } from './routing'

export const { Link, redirect, usePathname, useRouter } = createNavigation(routing)
```

- [ ] **Step 4: Create `src/i18n/request.ts`**

```ts
import { getRequestConfig } from 'next-intl/server'
import { routing } from './routing'

export default getRequestConfig(async ({ requestLocale }) => {
  let locale = await requestLocale
  if (!locale || !routing.locales.includes(locale as any)) {
    locale = routing.defaultLocale
  }
  return {
    locale,
    messages: (await import(`./${locale}.json`)).default,
  }
})
```

- [ ] **Step 5: Create `src/i18n/uk.json`**

Extract ALL hardcoded Ukrainian text from every component into this JSON. Structure by component name:

```json
{
  "metadata": {
    "title": "Neuronix AI — Інтегруємо інтелект у процеси",
    "description": "Neuronix AI — автоматизація бізнесу за допомогою штучного інтелекту. Голосові AI-агенти, чат-боти, n8n workflow, веб-додатки. AI-агентство в Україні."
  },
  "nav": {
    "services": "Послуги",
    "cases": "Кейси",
    "about": "Про нас",
    "testimonials": "Відгуки",
    "contact": "Контакти",
    "cta": "Почати проєкт"
  },
  "hero": {
    "titleStart": "Інтегруємо ",
    "titleHighlight": "інтелект",
    "titleEnd": " у процеси",
    "subtitle": "AI автоматизація для малого і середнього бізнесу — голосові агенти, чат-боти, сайти, n8n workflow",
    "cta": "Отримати консультацію",
    "scroll": "Scroll"
  },
  "services": {
    "title": "Наші послуги",
    "items": [
      {
        "icon": "🎙️",
        "title": "Голосові AI-агенти",
        "description": "Автоматичні дзвінки та прийом викликів. Підтвердження замовлень, опитування, підтримка — 24/7 без менеджерів."
      },
      {
        "icon": "💬",
        "title": "Чат-боти",
        "description": "Інтелектуальні боти для Telegram, Viber, сайтів. Відповідають на питання, приймають замовлення, ведуть CRM."
      },
      {
        "icon": "🌐",
        "title": "Веб-додатки",
        "description": "Лендінги, адмін-панелі, дашборди. React, Next.js, TypeScript — швидко, красиво, під ключ."
      },
      {
        "icon": "⚡",
        "title": "n8n Автоматизація",
        "description": "Зв'язуємо CRM, месенджери, бази даних, AI в єдиний workflow. Без ручної роботи."
      },
      {
        "icon": "🤖",
        "title": "AI Контент",
        "description": "Генерація описів, банерів, email-розсилок за допомогою AI. Персоналізація під кожного клієнта."
      },
      {
        "icon": "🔗",
        "title": "Інтеграції",
        "description": "API для 1С, OpenCart, Horoshop, KeyCRM, Binotel, SalesDrive. Синхронізація даних між системами."
      }
    ]
  },
  "cases": {
    "title": "Кейси",
    "items": [
      {
        "tag": "E-commerce",
        "tagColor": "#FF2D78",
        "title": "Abertime — каталог годинників",
        "problem": "Ручне оновлення 15,000+ товарів між 1С, OpenCart та маркетплейсами",
        "solution": "n8n workflow для автосинхронізації + адмін-панель для керування акціями та банерами",
        "metrics": ["15,000+ товарів", "Автосинхронізація 1С↔OpenCart", "Генерація банерів AI"]
      },
      {
        "tag": "Voice AI",
        "tagColor": "#7B2FFF",
        "title": "Cornix — голосовий агент SportVida",
        "problem": "Менеджери витрачали 2+ години на день на підтвердження замовлень по телефону",
        "solution": "AI-агент на базі Vapi автоматично дзвонить клієнтам, підтверджує замовлення, оновлює CRM",
        "metrics": ["70% менше ручної роботи", "24/7 автодзвінки", "SalesDrive інтеграція"]
      },
      {
        "tag": "Analytics",
        "tagColor": "#00D4FF",
        "title": "BESPORT — аналітика дзвінків",
        "problem": "Немає контролю якості дзвінків менеджерів спортклубу",
        "solution": "Deepgram транскрипція + Claude AI аналіз + Telegram звіти для керівництва",
        "metrics": ["Автотранскрипція", "AI-оцінка якості", "Telegram дашборд"]
      },
      {
        "tag": "CRM",
        "tagColor": "#FF8C00",
        "title": "WaterDelivery — доставка води",
        "problem": "Хаотичні замовлення через телефон, Excel-таблиці, загублені заявки",
        "solution": "AI голосовий агент для прийому замовлень + CRM з маршрутизацією доставок",
        "metrics": ["AI прийом замовлень", "CRM з маршрутами", "Binotel інтеграція"]
      },
      {
        "tag": "Automation",
        "tagColor": "#00FF88",
        "title": "Banner Automation — генерація банерів",
        "problem": "Дизайнер витрачав 30+ хвилин на кожен акційний банер для сайту",
        "solution": "Python + Pillow автоматично генерує банери з даних 1С, публікує через n8n",
        "metrics": ["30 сек замість 30 хв", "Авто-публікація", "Шаблони під бренд"]
      },
      {
        "tag": "Telegram App",
        "tagColor": "#0088FF",
        "title": "WOD Champ — CrossFit трекер",
        "problem": "Спортсмени записували результати в блокноти, тренери не мали аналітики",
        "solution": "Telegram Mini App з Supabase backend — логування WOD, таблиці лідерів, історія",
        "metrics": ["Telegram Mini App", "Real-time лідерборд", "Supabase backend"]
      }
    ]
  },
  "about": {
    "title": "Чому Neuronix?",
    "description": "Neuronix — AI-агентство в Україні, що спеціалізується на автоматизації бізнес-процесів за допомогою штучного інтелекту. Ми створюємо голосових AI-агентів, чат-ботів, workflow-системи та веб-додатки, які замінюють рутинну роботу і працюють 24/7.",
    "counters": [
      { "value": 12, "suffix": "+", "label": "Реалізованих проєктів" },
      { "value": 300, "suffix": "+", "label": "Годин зекономлено" },
      { "value": 15, "suffix": "+", "label": "Технологій у стеку" }
    ]
  },
  "testimonials": {
    "title": "Відгуки клієнтів",
    "items": [
      {
        "quote": "Neuronix автоматизували синхронізацію нашого каталогу з 15,000 годинників. Тепер все оновлюється само — ціни, наявність, акції. Раніше це забирало цілий день.",
        "author": "Abertime",
        "role": "Інтернет-магазин годинників",
        "initials": "AB"
      },
      {
        "quote": "AI-агент дзвонить клієнтам і підтверджує замовлення за нас. Менеджери нарешті зайняті продажами, а не рутиною. ROI окупився за перший місяць.",
        "author": "SportVida",
        "role": "Спортивний інтернет-магазин",
        "initials": "SV"
      },
      {
        "quote": "Нарешті нормальна система замовлень замість Excel-хаосу. AI приймає дзвінки, CRM розподіляє маршрути. Клієнти задоволені, ми теж.",
        "author": "WaterDelivery",
        "role": "Доставка води",
        "initials": "WD"
      }
    ]
  },
  "contact": {
    "title": "Почнімо проєкт",
    "subtitle": "Розкажіть про вашу задачу — ми запропонуємо рішення",
    "form": {
      "name": "Ваше ім'я",
      "phone": "Телефон",
      "message": "Опишіть задачу",
      "submit": "Надіслати заявку",
      "submitting": "Надсилаємо...",
      "success": "Дякуємо! Ми зв'яжемося з вами найближчим часом.",
      "error": "Щось пішло не так. Спробуйте ще раз або напишіть в Telegram.",
      "errorName": "Вкажіть ім'я",
      "errorPhone": "Невірний номер телефону"
    },
    "info": {
      "phone": "+380 63 213 13 23",
      "telegram": "Telegram",
      "telegramUrl": "https://t.me/FitLifeMeneger"
    }
  },
  "footer": {
    "copyright": "© 2026 Neuronix AI. Всі права захищені."
  },
  "faq": {
    "title": "Часті питання",
    "items": [
      {
        "question": "Хто надає послуги AI-автоматизації в Україні?",
        "answer": "Neuronix AI — українське AI-агентство, що спеціалізується на автоматизації бізнес-процесів. Ми створюємо голосових AI-агентів, чат-ботів, n8n workflow та веб-додатки для малого і середнього бізнесу."
      },
      {
        "question": "Що робить AI-агентство?",
        "answer": "AI-агентство розробляє рішення на базі штучного інтелекту для бізнесу: голосові агенти для автоматичних дзвінків, чат-боти для підтримки клієнтів, автоматизація рутинних процесів через workflow-системи, аналітика та інтеграція з CRM."
      },
      {
        "question": "Як голосові AI-агенти можуть допомогти бізнесу?",
        "answer": "Голосові AI-агенти автоматично дзвонять клієнтам для підтвердження замовлень, проводять опитування, приймають вхідні дзвінки 24/7. Це скорочує навантаження на менеджерів на 70% та прискорює обробку замовлень."
      },
      {
        "question": "Скільки коштує AI-автоматизація?",
        "answer": "Вартість залежить від складності проєкту. Простий чат-бот — від $500, голосовий агент — від $1000, комплексна автоматизація з CRM — від $2000. Перша консультація безкоштовна."
      },
      {
        "question": "Які технології використовує Neuronix?",
        "answer": "Ми працюємо з n8n, Vapi, Supabase, React, Next.js, TypeScript, Claude AI, Deepgram, Telegram Bot API, OpenCart, 1С, KeyCRM, Binotel, SalesDrive та іншими платформами."
      }
    ]
  }
}
```

- [ ] **Step 6: Create `src/i18n/en.json`**

Same structure, English translations:

```json
{
  "metadata": {
    "title": "Neuronix AI — Integrating Intelligence Into Business Processes",
    "description": "Neuronix AI — AI-powered business automation agency in Ukraine. Voice AI agents, chatbots, n8n workflows, web applications. Automate your business with artificial intelligence."
  },
  "nav": {
    "services": "Services",
    "cases": "Cases",
    "about": "About",
    "testimonials": "Testimonials",
    "contact": "Contact",
    "cta": "Start a Project"
  },
  "hero": {
    "titleStart": "Integrating ",
    "titleHighlight": "intelligence",
    "titleEnd": " into processes",
    "subtitle": "AI automation for small and medium business — voice agents, chatbots, websites, n8n workflows",
    "cta": "Get a Consultation",
    "scroll": "Scroll"
  },
  "services": {
    "title": "Our Services",
    "items": [
      {
        "icon": "🎙️",
        "title": "Voice AI Agents",
        "description": "Automated calls and incoming call handling. Order confirmation, surveys, support — 24/7 without managers."
      },
      {
        "icon": "💬",
        "title": "Chatbots",
        "description": "Intelligent bots for Telegram, Viber, websites. Answer questions, take orders, manage CRM."
      },
      {
        "icon": "🌐",
        "title": "Web Applications",
        "description": "Landing pages, admin panels, dashboards. React, Next.js, TypeScript — fast, beautiful, turnkey."
      },
      {
        "icon": "⚡",
        "title": "n8n Automation",
        "description": "Connect CRM, messengers, databases, AI into a single workflow. No manual work."
      },
      {
        "icon": "🤖",
        "title": "AI Content",
        "description": "Generate descriptions, banners, email campaigns with AI. Personalized for each client."
      },
      {
        "icon": "🔗",
        "title": "Integrations",
        "description": "APIs for 1C, OpenCart, Horoshop, KeyCRM, Binotel, SalesDrive. Data synchronization between systems."
      }
    ]
  },
  "cases": {
    "title": "Case Studies",
    "items": [
      {
        "tag": "E-commerce",
        "tagColor": "#FF2D78",
        "title": "Abertime — Watch Catalog",
        "problem": "Manual updating of 15,000+ products between 1C, OpenCart, and marketplaces",
        "solution": "n8n workflow for auto-sync + admin panel for managing promotions and banners",
        "metrics": ["15,000+ products", "Auto-sync 1C↔OpenCart", "AI banner generation"]
      },
      {
        "tag": "Voice AI",
        "tagColor": "#7B2FFF",
        "title": "Cornix — SportVida Voice Agent",
        "problem": "Managers spent 2+ hours daily confirming orders by phone",
        "solution": "Vapi-based AI agent automatically calls clients, confirms orders, updates CRM",
        "metrics": ["70% less manual work", "24/7 auto-calls", "SalesDrive integration"]
      },
      {
        "tag": "Analytics",
        "tagColor": "#00D4FF",
        "title": "BESPORT — Call Analytics",
        "problem": "No quality control for sports club managers' calls",
        "solution": "Deepgram transcription + Claude AI analysis + Telegram reports for management",
        "metrics": ["Auto-transcription", "AI quality scoring", "Telegram dashboard"]
      },
      {
        "tag": "CRM",
        "tagColor": "#FF8C00",
        "title": "WaterDelivery — Water Delivery",
        "problem": "Chaotic orders via phone, Excel spreadsheets, lost requests",
        "solution": "AI voice agent for order intake + CRM with delivery route management",
        "metrics": ["AI order intake", "CRM with routes", "Binotel integration"]
      },
      {
        "tag": "Automation",
        "tagColor": "#00FF88",
        "title": "Banner Automation — Banner Generation",
        "problem": "Designer spent 30+ minutes on each promotional banner for the website",
        "solution": "Python + Pillow automatically generates banners from 1C data, publishes via n8n",
        "metrics": ["30 sec instead of 30 min", "Auto-publishing", "Brand templates"]
      },
      {
        "tag": "Telegram App",
        "tagColor": "#0088FF",
        "title": "WOD Champ — CrossFit Tracker",
        "problem": "Athletes recorded results in notebooks, trainers had no analytics",
        "solution": "Telegram Mini App with Supabase backend — WOD logging, leaderboards, history",
        "metrics": ["Telegram Mini App", "Real-time leaderboard", "Supabase backend"]
      }
    ]
  },
  "about": {
    "title": "Why Neuronix?",
    "description": "Neuronix is an AI automation agency in Ukraine specializing in business process automation using artificial intelligence. We build voice AI agents, chatbots, workflow systems, and web applications that replace routine work and operate 24/7.",
    "counters": [
      { "value": 12, "suffix": "+", "label": "Projects completed" },
      { "value": 300, "suffix": "+", "label": "Hours saved" },
      { "value": 15, "suffix": "+", "label": "Technologies in stack" }
    ]
  },
  "testimonials": {
    "title": "Client Testimonials",
    "items": [
      {
        "quote": "Neuronix automated the synchronization of our 15,000-watch catalog. Now everything updates automatically — prices, availability, promotions. It used to take an entire day.",
        "author": "Abertime",
        "role": "Online watch store",
        "initials": "AB"
      },
      {
        "quote": "The AI agent calls clients and confirms orders for us. Managers are finally focused on sales, not routine. ROI paid off in the first month.",
        "author": "SportVida",
        "role": "Sports e-commerce store",
        "initials": "SV"
      },
      {
        "quote": "Finally a proper order system instead of Excel chaos. AI takes calls, CRM distributes routes. Clients are happy, so are we.",
        "author": "WaterDelivery",
        "role": "Water delivery service",
        "initials": "WD"
      }
    ]
  },
  "contact": {
    "title": "Start a Project",
    "subtitle": "Tell us about your task — we'll suggest a solution",
    "form": {
      "name": "Your name",
      "phone": "Phone",
      "message": "Describe your task",
      "submit": "Submit request",
      "submitting": "Sending...",
      "success": "Thank you! We'll get back to you shortly.",
      "error": "Something went wrong. Try again or message us on Telegram.",
      "errorName": "Enter your name",
      "errorPhone": "Invalid phone number"
    },
    "info": {
      "phone": "+380 63 213 13 23",
      "telegram": "Telegram",
      "telegramUrl": "https://t.me/FitLifeMeneger"
    }
  },
  "footer": {
    "copyright": "© 2026 Neuronix AI. All rights reserved."
  },
  "faq": {
    "title": "Frequently Asked Questions",
    "items": [
      {
        "question": "Who provides AI automation services in Ukraine?",
        "answer": "Neuronix AI is a Ukrainian AI agency specializing in business process automation. We build voice AI agents, chatbots, n8n workflows, and web applications for small and medium businesses."
      },
      {
        "question": "What does an AI automation agency do?",
        "answer": "An AI agency develops artificial intelligence solutions for business: voice agents for automated calls, chatbots for customer support, routine process automation through workflow systems, analytics, and CRM integration."
      },
      {
        "question": "How can voice AI agents help my business?",
        "answer": "Voice AI agents automatically call clients to confirm orders, conduct surveys, handle incoming calls 24/7. This reduces manager workload by 70% and speeds up order processing."
      },
      {
        "question": "How much does AI automation cost?",
        "answer": "Cost depends on project complexity. A simple chatbot starts from $500, voice agent from $1000, comprehensive automation with CRM from $2000. First consultation is free."
      },
      {
        "question": "What technologies does Neuronix use?",
        "answer": "We work with n8n, Vapi, Supabase, React, Next.js, TypeScript, Claude AI, Deepgram, Telegram Bot API, OpenCart, 1C, KeyCRM, Binotel, SalesDrive, and other platforms."
      }
    ]
  }
}
```

- [ ] **Step 7: Create `src/middleware.ts`**

```ts
import createMiddleware from 'next-intl/middleware'
import { routing } from './i18n/routing'

export default createMiddleware(routing)

export const config = {
  matcher: ['/', '/(uk|en)/:path*'],
}
```

- [ ] **Step 8: Commit**

```bash
git add src/i18n/ src/middleware.ts
git commit -m "feat: set up next-intl v4 i18n with uk/en translations"
```

---

## Task 3: Create root layout and locale layout

**Files:**
- Create: `src/app/layout.tsx`
- Create: `src/app/[locale]/layout.tsx`
- Create: `src/lib/metadata.ts`
- Create: `src/lib/structured-data.ts`

- [ ] **Step 1: Create `src/lib/metadata.ts`**

```ts
import type { Metadata } from 'next'
import { type Locale } from '@/i18n/config'

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://neuronix.work'

export function generateLocaleMetadata(
  locale: Locale,
  messages: Record<string, any>
): Metadata {
  const meta = messages.metadata
  return {
    title: meta.title,
    description: meta.description,
    alternates: {
      canonical: `${SITE_URL}/${locale}`,
      languages: {
        uk: `${SITE_URL}/uk`,
        en: `${SITE_URL}/en`,
      },
    },
    openGraph: {
      title: meta.title,
      description: meta.description,
      url: `${SITE_URL}/${locale}`,
      siteName: 'Neuronix AI',
      locale: locale === 'uk' ? 'uk_UA' : 'en_US',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: meta.title,
      description: meta.description,
    },
  }
}
```

- [ ] **Step 2: Create `src/lib/structured-data.ts`**

```ts
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://neuronix.work'

export function getOrganizationSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'Neuronix AI',
    url: SITE_URL,
    logo: `${SITE_URL}/favicon.svg`,
    contactPoint: {
      '@type': 'ContactPoint',
      telephone: '+380632131323',
      contactType: 'sales',
      availableLanguage: ['Ukrainian', 'English'],
    },
    sameAs: ['https://t.me/FitLifeMeneger'],
  }
}

export function getWebSiteSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'Neuronix AI',
    url: SITE_URL,
    potentialAction: {
      '@type': 'SearchAction',
      target: `${SITE_URL}/?q={search_term_string}`,
      'query-input': 'required name=search_term_string',
    },
  }
}

export function getServicesSchema(services: Array<{ title: string; description: string }>) {
  return services.map((s) => ({
    '@context': 'https://schema.org',
    '@type': 'Service',
    provider: { '@type': 'Organization', name: 'Neuronix AI' },
    name: s.title,
    description: s.description,
    areaServed: 'UA',
  }))
}

export function getFAQSchema(items: Array<{ question: string; answer: string }>) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: items.map((item) => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: item.answer,
      },
    })),
  }
}
```

- [ ] **Step 3: Create `src/app/layout.tsx` (root layout)**

In next-intl v4, the root layout does NOT render `<html>`/`<body>` — the `[locale]/layout.tsx` does.
This is the recommended pattern for locale-aware `lang` attribute on `<html>`.

```tsx
import type { ReactNode } from 'react'

// Root layout just passes through to locale layout
// html and body tags are rendered in [locale]/layout.tsx
export default function RootLayout({ children }: { children: ReactNode }) {
  return children
}
```

- [ ] **Step 4: Create `src/app/[locale]/layout.tsx`**

```tsx
import type { ReactNode } from 'react'
import type { Metadata } from 'next'
import { NextIntlClientProvider } from 'next-intl'
import { getMessages, setRequestLocale } from 'next-intl/server'
import { notFound } from 'next/navigation'
import { routing } from '@/i18n/routing'
import { type Locale } from '@/i18n/config'
import { generateLocaleMetadata } from '@/lib/metadata'
import {
  getOrganizationSchema,
  getWebSiteSchema,
  getServicesSchema,
  getFAQSchema,
} from '@/lib/structured-data'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import '@/styles/variables.css'
import '@/styles/global.css'
import '@/styles/sections-video.css'

type Props = { params: Promise<{ locale: string }> }

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  setRequestLocale(locale)
  const messages = await getMessages()
  return generateLocaleMetadata(locale as Locale, messages as Record<string, any>)
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: ReactNode
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params

  if (!routing.locales.includes(locale as any)) {
    notFound()
  }

  // Required for static rendering in next-intl v4
  setRequestLocale(locale)

  const messages = await getMessages()
  const msg = messages as Record<string, any>

  const schemas = [
    getOrganizationSchema(),
    getWebSiteSchema(),
    ...getServicesSchema(msg.services.items),
    getFAQSchema(msg.faq.items),
  ]

  return (
    <html lang={locale}>
      <head>
        <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Orbitron:wght@400;500;600;700;800;900&family=Syne:wght@400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
        {schemas.map((schema, i) => (
          <script
            key={i}
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
          />
        ))}
      </head>
      <body>
        <NextIntlClientProvider messages={messages}>
          <Navbar />
          <main>{children}</main>
          <Footer />
        </NextIntlClientProvider>
      </body>
    </html>
  )
}
```

- [ ] **Step 5: Commit**

```bash
git add src/app/ src/lib/
git commit -m "feat: root and locale layouts with metadata and JSON-LD"
```

---

## Task 4: Migrate Navbar with LanguageSwitcher

**Files:**
- Modify: `src/components/Navbar.tsx`
- Create: `src/components/LanguageSwitcher.tsx`
- Modify: `src/components/css/Navbar.css` (minor additions for lang switcher)

- [ ] **Step 1: Create `src/components/LanguageSwitcher.tsx`**

```tsx
'use client'

import { useLocale } from 'next-intl'
import { useRouter, usePathname } from '@/i18n/navigation'
import { type Locale } from '@/i18n/config'

export default function LanguageSwitcher() {
  const locale = useLocale() as Locale
  const router = useRouter()
  const pathname = usePathname()

  const switchLocale = (newLocale: Locale) => {
    router.replace(pathname, { locale: newLocale, scroll: false })
  }

  return (
    <div className="lang-switcher">
      <button
        className={`lang-btn ${locale === 'uk' ? 'lang-btn-active' : ''}`}
        onClick={() => switchLocale('uk')}
      >
        UA
      </button>
      <span className="lang-divider">/</span>
      <button
        className={`lang-btn ${locale === 'en' ? 'lang-btn-active' : ''}`}
        onClick={() => switchLocale('en')}
      >
        EN
      </button>
    </div>
  )
}
```

- [ ] **Step 2: Migrate `src/components/Navbar.tsx`**

Add `'use client'` at top. Replace hardcoded NAV_ITEMS and CTA text with `useTranslations()`. Import and render `LanguageSwitcher` next to the CTA button. Keep all GSAP animations, scroll logic, mobile menu as-is. Update CSS import path to `./css/Navbar.css`.

Key changes:
- `const t = useTranslations('nav')`
- NAV_ITEMS: `[{ label: t('services'), id: 'services' }, ...]`
- CTA button text: `{t('cta')}`
- Add `<LanguageSwitcher />` in nav-actions area

- [ ] **Step 3: Add lang switcher styles to `src/components/css/Navbar.css`**

Append:
```css
.lang-switcher {
  display: flex;
  align-items: center;
  gap: 4px;
  margin-left: 12px;
}

.lang-btn {
  background: none;
  border: none;
  color: var(--text-muted);
  font-family: var(--font-body);
  font-size: 0.85rem;
  cursor: pointer;
  padding: 4px 6px;
  transition: color 0.3s;
}

.lang-btn:hover {
  color: var(--text);
}

.lang-btn-active {
  color: var(--primary);
  font-weight: 600;
}

.lang-divider {
  color: var(--text-muted);
  font-size: 0.85rem;
}
```

- [ ] **Step 4: Commit**

```bash
git add src/components/Navbar.tsx src/components/LanguageSwitcher.tsx src/components/css/Navbar.css
git commit -m "feat: migrate Navbar with i18n and language switcher"
```

---

## Task 5: Migrate Hero component

**Files:**
- Modify: `src/components/Hero.tsx`

- [ ] **Step 1: Migrate Hero.tsx**

Add `'use client'` at top. Replace hardcoded text with `useTranslations('hero')`:
- Title: `{t('titleStart')}<span className="hero-title-gradient">{t('titleHighlight')}</span>{t('titleEnd')}`
- Subtitle: `{t('subtitle')}`
- CTA: `{t('cta')}`
- Scroll: `{t('scroll')}`

Update CSS import to `./css/Hero.css`. Keep all GSAP animations as-is.

- [ ] **Step 2: Commit**

```bash
git add src/components/Hero.tsx
git commit -m "feat: migrate Hero with i18n translations"
```

---

## Task 6: Migrate Services component

**Files:**
- Modify: `src/components/Services.tsx`

- [ ] **Step 1: Migrate Services.tsx**

Add `'use client'`. Replace hardcoded services array with translations:
- `const t = useTranslations('services')`
- Section title: `{t('title')}`
- Map over items: use `t.raw('items')` to get the array, then map rendering each card

Update CSS import to `./css/Services.css`.

- [ ] **Step 2: Commit**

```bash
git add src/components/Services.tsx
git commit -m "feat: migrate Services with i18n translations"
```

---

## Task 7: Migrate Cases component

**Files:**
- Modify: `src/components/Cases.tsx`

- [ ] **Step 1: Migrate Cases.tsx**

Add `'use client'`. Replace hardcoded cases array:
- `const t = useTranslations('cases')`
- Title: `{t('title')}`
- Items: `t.raw('items')` for the array

Update CSS import to `./css/Cases.css`.

- [ ] **Step 2: Commit**

```bash
git add src/components/Cases.tsx
git commit -m "feat: migrate Cases with i18n translations"
```

---

## Task 8: Migrate About component

**Files:**
- Modify: `src/components/About.tsx`

- [ ] **Step 1: Migrate About.tsx**

Add `'use client'`. Replace hardcoded text:
- `const t = useTranslations('about')`
- Title: `{t('title')}`
- Description: `{t('description')}`
- Counters: `t.raw('counters')` for the array

Update CSS import to `./css/About.css`.

- [ ] **Step 2: Commit**

```bash
git add src/components/About.tsx
git commit -m "feat: migrate About with i18n translations"
```

---

## Task 9: Migrate Testimonials component

**Files:**
- Modify: `src/components/Testimonials.tsx`

- [ ] **Step 1: Migrate Testimonials.tsx**

Add `'use client'`. Replace hardcoded testimonials array:
- `const t = useTranslations('testimonials')`
- Title: `{t('title')}`
- Items: `t.raw('items')`

Update CSS import to `./css/Testimonials.css`.

- [ ] **Step 2: Commit**

```bash
git add src/components/Testimonials.tsx
git commit -m "feat: migrate Testimonials with i18n translations"
```

---

## Task 10: Migrate Contact and extract Footer

**Files:**
- Modify: `src/components/Contact.tsx`
- Create: `src/components/Footer.tsx`
- Create: `src/components/css/Footer.css`

- [ ] **Step 1: Create `src/components/Footer.tsx`**

Server Component (no `'use client'`). Extract footer markup from Contact.tsx:

```tsx
import { useTranslations } from 'next-intl'
import { setRequestLocale } from 'next-intl/server'
import { useLocale } from 'next-intl'
import './css/Footer.css'

export default function Footer() {
  const locale = useLocale()
  setRequestLocale(locale)
  const t = useTranslations('footer')
  return (
    <footer className="footer">
      <div className="footer-separator" />
      <p className="footer-copyright">{t('copyright')}</p>
    </footer>
  )
}
```

- [ ] **Step 2: Create `src/components/css/Footer.css`**

Extract footer styles from Contact.css:
```css
.footer {
  text-align: center;
  padding: 2rem 0;
  position: relative;
}

.footer-separator {
  width: 120px;
  height: 2px;
  margin: 0 auto 1.5rem;
  background: linear-gradient(90deg, transparent, var(--primary), var(--secondary), transparent);
}

.footer-copyright {
  color: var(--text-muted);
  font-size: 0.85rem;
}
```

- [ ] **Step 3: Migrate Contact.tsx**

Add `'use client'`. Replace hardcoded text with `useTranslations('contact')`. Replace hardcoded webhook URL with `process.env.NEXT_PUBLIC_WEBHOOK_URL`. Remove footer markup (now in Footer component). Update CSS import to `./css/Contact.css`. Remove footer styles from Contact.css.

- [ ] **Step 4: Commit**

```bash
git add src/components/Contact.tsx src/components/Footer.tsx src/components/css/Footer.css src/components/css/Contact.css
git commit -m "feat: migrate Contact with i18n, extract Footer component"
```

---

## Task 11: Create FAQ component

**Files:**
- Create: `src/components/FAQ.tsx`
- Create: `src/components/css/FAQ.css`

- [ ] **Step 1: Create `src/components/FAQ.tsx`**

Server Component for maximum SEO:

```tsx
import { useTranslations, useLocale } from 'next-intl'
import { setRequestLocale } from 'next-intl/server'
import './css/FAQ.css'

export default function FAQ() {
  const locale = useLocale()
  setRequestLocale(locale)
  const t = useTranslations('faq')
  const items = t.raw('items') as Array<{ question: string; answer: string }>

  return (
    <section className="faq" id="faq">
      <h2 className="faq-title">{t('title')}</h2>
      <div className="faq-list">
        {items.map((item, i) => (
          <details key={i} className="faq-item">
            <summary className="faq-question">{item.question}</summary>
            <p className="faq-answer">{item.answer}</p>
          </details>
        ))}
      </div>
    </section>
  )
}
```

- [ ] **Step 2: Create `src/components/css/FAQ.css`**

```css
.faq {
  padding: 6rem 2rem;
  max-width: 800px;
  margin: 0 auto;
}

.faq-title {
  text-align: center;
  margin-bottom: 3rem;
}

.faq-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.faq-item {
  background: var(--glass-bg);
  border: 1px solid var(--glass-border);
  border-radius: 12px;
  padding: 1.25rem 1.5rem;
  backdrop-filter: blur(var(--glass-blur));
  transition: border-color 0.3s;
}

.faq-item[open] {
  border-color: var(--primary);
}

.faq-question {
  font-weight: 600;
  cursor: pointer;
  color: var(--text);
  font-size: 1.05rem;
  list-style: none;
}

.faq-question::marker {
  display: none;
}

.faq-question::-webkit-details-marker {
  display: none;
}

.faq-answer {
  color: var(--text-muted);
  margin-top: 0.75rem;
  line-height: 1.7;
  font-size: 0.95rem;
}
```

- [ ] **Step 3: Commit**

```bash
git add src/components/FAQ.tsx src/components/css/FAQ.css
git commit -m "feat: add FAQ section for SEO and AI visibility"
```

---

## Task 12: Create main page with VideoBackground

**Note:** This task comes after all component migrations (Tasks 4-11) so all imports resolve.

**Files:**
- Create: `src/app/[locale]/page.tsx`
- Create: `src/components/VideoBackground.tsx`

- [ ] **Step 1: Create `src/components/VideoBackground.tsx`**

```tsx
'use client'

import { useRef, useEffect, type ReactNode } from 'react'

export default function VideoBackground({ children }: { children: ReactNode }) {
  const videoRef = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    const video = videoRef.current
    if (!video) return

    let rafId: number
    const tick = () => {
      if (video.duration && video.duration - video.currentTime < 0.15) {
        video.currentTime = 0
      }
      rafId = requestAnimationFrame(tick)
    }
    rafId = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(rafId)
  }, [])

  return (
    <div className="sections-video-wrapper">
      <video
        ref={videoRef}
        className="sections-video-bg"
        autoPlay
        muted
        playsInline
        poster="/sections-bg-poster.jpg"
      >
        <source src="/sections-bg.mp4" type="video/mp4" />
      </video>
      <div className="sections-video-overlay" />
      <div className="sections-video-fade-top" />
      <div className="sections-content">{children}</div>
    </div>
  )
}
```

- [ ] **Step 2: Create `src/app/[locale]/page.tsx`**

```tsx
import Hero from '@/components/Hero'
import Services from '@/components/Services'
import Cases from '@/components/Cases'
import About from '@/components/About'
import FAQ from '@/components/FAQ'
import Testimonials from '@/components/Testimonials'
import Contact from '@/components/Contact'
import VideoBackground from '@/components/VideoBackground'

export default function HomePage() {
  return (
    <>
      <Hero />
      <VideoBackground>
        <Services />
        <Cases />
        <About />
        <Testimonials />
        <FAQ />
        <Contact />
      </VideoBackground>
    </>
  )
}
```

- [ ] **Step 3: Commit**

```bash
git add src/app/[locale]/page.tsx src/components/VideoBackground.tsx
git commit -m "feat: main page with VideoBackground component"
```

---

## Task 13: Create sitemap and robots

**Files:**
- Create: `src/app/sitemap.ts`
- Create: `src/app/robots.ts`

- [ ] **Step 1: Create `src/app/sitemap.ts`**

```ts
import type { MetadataRoute } from 'next'
import { locales } from '@/i18n/config'

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://neuronix.work'

export default function sitemap(): MetadataRoute.Sitemap {
  return locales.map((locale) => ({
    url: `${SITE_URL}/${locale}`,
    lastModified: new Date(),
    changeFrequency: 'weekly',
    priority: 1,
    alternates: {
      languages: Object.fromEntries(
        locales.map((l) => [l, `${SITE_URL}/${l}`])
      ),
    },
  }))
}
```

- [ ] **Step 2: Create `src/app/robots.ts`**

```ts
import type { MetadataRoute } from 'next'

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://neuronix.work'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
      },
      {
        userAgent: 'GPTBot',
        allow: '/',
      },
      {
        userAgent: 'ClaudeBot',
        allow: '/',
      },
      {
        userAgent: 'PerplexityBot',
        allow: '/',
      },
      {
        userAgent: 'Google-Extended',
        allow: '/',
      },
      {
        userAgent: 'CCBot',
        allow: '/',
      },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
  }
}
```

- [ ] **Step 3: Commit**

```bash
git add src/app/sitemap.ts src/app/robots.ts
git commit -m "feat: add sitemap and robots.txt with AI crawler rules"
```

---

## Task 14: Create 404 pages

**Files:**
- Create: `src/app/not-found.tsx` (root-level fallback)
- Create: `src/app/[locale]/not-found.tsx` (locale-aware)

- [ ] **Step 1: Create `src/app/not-found.tsx` (root-level fallback)**

Catches requests that don't match any locale (e.g., `/fr/something`):

```tsx
export default function RootNotFound() {
  return (
    <html lang="en">
      <body style={{ background: '#050510', color: '#fff', fontFamily: 'sans-serif' }}>
        <section style={{ textAlign: 'center', padding: '6rem 2rem' }}>
          <h1>404</h1>
          <p style={{ color: '#8892A4', marginTop: '1rem' }}>
            Page not found / Сторінку не знайдено
          </p>
        </section>
      </body>
    </html>
  )
}
```

- [ ] **Step 2: Create `src/app/[locale]/not-found.tsx`**

```tsx
import { useTranslations } from 'next-intl'

export default function NotFound() {
  return (
    <section style={{ textAlign: 'center', padding: '6rem 2rem' }}>
      <h1>404</h1>
      <p style={{ color: 'var(--text-muted)', marginTop: '1rem' }}>
        Page not found / Сторінку не знайдено
      </p>
    </section>
  )
}
```

- [ ] **Step 3: Commit**

```bash
git add src/app/not-found.tsx src/app/[locale]/not-found.tsx
git commit -m "feat: add 404 pages (root and locale-aware)"
```

---

## Task 15: Clean up old files and verify build

**Files:**
- Remove: `src/App.tsx`, `src/main.tsx`
- Remove: `vite.config.ts`, `tsconfig.node.json`, `eslint.config.js`, `index.html` (if not removed in Task 1)

- [ ] **Step 1: Remove old entry points**

```bash
rm -f src/App.tsx src/main.tsx
```

- [ ] **Step 2: Verify build**

```bash
npm run build
```

Expected: Build succeeds, generates static pages for `/uk` and `/en`.

- [ ] **Step 3: Verify dev server**

```bash
npm run dev
```

Check in browser:
- `http://localhost:3000` → redirects to `/uk`
- `http://localhost:3000/uk` → Ukrainian version
- `http://localhost:3000/en` → English version
- Language switcher works
- All animations work
- Contact form submits
- All sections render

- [ ] **Step 4: Verify SEO output**

```bash
# Check generated HTML for SEO elements
curl -s http://localhost:3000/uk | grep -E '<title>|<meta name="description"|application/ld\+json|hreflang'
curl -s http://localhost:3000/en | grep -E '<title>|<meta name="description"|application/ld\+json|hreflang'
curl -s http://localhost:3000/sitemap.xml
curl -s http://localhost:3000/robots.txt
```

- [ ] **Step 5: Commit**

```bash
git add -A
git commit -m "chore: remove old Vite files, verify Next.js build"
```

---

## Task 16: Deploy to Vercel

- [ ] **Step 1: Push and deploy**

```bash
git push
```

Vercel auto-deploys on push. Verify:
- Production URL loads
- Both `/uk` and `/en` work
- `NEXT_PUBLIC_WEBHOOK_URL` is set in Vercel env vars
- `NEXT_PUBLIC_SITE_URL` is set in Vercel env vars

- [ ] **Step 2: Verify production SEO**

```bash
curl -s https://neuronix.work/uk | grep -c 'application/ld+json'
curl -s https://neuronix.work/sitemap.xml
curl -s https://neuronix.work/robots.txt
```

- [ ] **Step 3: Final commit (if any env/config fixes needed)**

```bash
git add -A
git commit -m "fix: production deployment adjustments"
```
