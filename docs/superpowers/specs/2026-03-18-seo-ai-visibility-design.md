# SEO & AI Visibility Optimization — Design Spec

## Goal

Maximize organic traffic (Google) and AI model visibility (ChatGPT, Claude, Perplexity) for Neuronix AI landing page. Target audience: B2B clients seeking AI automation in Ukraine. Bilingual: Ukrainian + English.

## Decision: Migrate from Vite SPA to Next.js 15

Current Vite + React SPA is invisible to crawlers and AI bots (JS-rendered content). Next.js with Static Site Generation produces clean HTML that all bots can index.

## Architecture

### Project Structure

```
src/
  app/
    [locale]/              # uk | en — dynamic route segment
      layout.tsx           # shared layout: Navbar, Footer, metadata, JSON-LD
      page.tsx             # main page: Hero, Services, Cases, About, FAQ, Testimonials, Contact
      not-found.tsx        # 404 page per locale
    sitemap.ts             # auto-generated sitemap.xml with both locales
    robots.ts              # robots.txt — allow all bots including AI crawlers
    layout.tsx             # root layout: fonts, global styles
  components/
    Navbar.tsx             # Server Component + client language switcher
    Hero.tsx               # Client Component (GSAP animations, video)
    Services.tsx           # Client Component (animations)
    Cases.tsx              # Client Component (animations)
    About.tsx              # Client Component (animations)
    Testimonials.tsx       # Client Component (animations)
    FAQ.tsx                # Server Component (SEO-critical, no JS needed)
    Contact.tsx            # Client Component (react-hook-form)
    Footer.tsx             # Server Component
    VideoBackground.tsx    # Client Component (video loop logic from App.tsx)
    LanguageSwitcher.tsx   # Client Component
  i18n/
    uk.json                # all Ukrainian texts
    en.json                # all English texts
    config.ts              # next-intl configuration
    request.ts             # next-intl server request config
  lib/
    metadata.ts            # generateMetadata() factory per locale
    structured-data.ts     # JSON-LD generators
  middleware.ts            # locale detection & redirect
```

### Rendering Strategy

- **Static Site Generation (SSG)** — pages pre-rendered at build time for both locales
- No runtime SSR needed — this is a static landing page
- `generateStaticParams()` returns `[{locale: 'uk'}, {locale: 'en'}]`

### Deploy

- Vercel (already configured)
- No infrastructure changes needed

## SEO Foundation

### Metadata (per locale)

Generated via `generateMetadata()` in `[locale]/layout.tsx`:

- `title` — unique per locale (e.g., "Neuronix AI — AI автоматизацiя для бiзнесу" / "Neuronix AI — AI Automation for Business")
- `description` — unique per locale, keyword-rich
- `alternates.languages` — hreflang links between uk and en
- `openGraph` — title, description, image, locale
- `twitter` — card, title, description, image
- `canonical` — explicit canonical URL per locale

### Structured Data (JSON-LD)

Embedded in `[locale]/layout.tsx`:

- **Organization** — name, logo, url, contactPoint, sameAs (social links)
- **WebSite** — name, url, potentialAction (SearchAction)
- **Service** (multiple) — each service as separate schema:
  - AI automation for business
  - Voice AI agents
  - Chatbots
  - n8n workflow automation
  - Website development
- **FAQPage** — question-answer pairs matching common search/AI queries

### Technical SEO

- `sitemap.xml` — auto-generated, includes `/uk` and `/en` URLs
- `robots.txt` — explicitly allows: Googlebot, Bingbot, GPTBot, ClaudeBot-Web, PerplexityBot, Google-Extended, CCBot
- Canonical URLs: `neuronix.work/uk`, `neuronix.work/en`
- Semantic HTML: `<main>`, `<article>`, `<section>`, `<header>`, `<nav>`, `<footer>`
- Heading hierarchy: single `<h1>` per page, logical `<h2>` → `<h3>` nesting
- All images: `alt` attributes in both languages

## AI Visibility

### Technical Accessibility

- SSG = clean HTML without JS execution requirement
- JSON-LD structured data — AI models parse this during RAG indexing
- Clean, descriptive URLs (`/en`, `/uk`)
- No client-side routing barriers for crawlers

### Content Strategy for AI Mentions

- **Explicit self-description**: "Neuronix — AI agency in Ukraine specializing in business process automation using voice agents, chatbots, and workflow systems"
- **FAQ section** targeting AI-query patterns:
  - "Who provides AI automation in Ukraine?"
  - "What does an AI automation agency do?"
  - "How can AI voice agents help my business?"
  - (bilingual versions)
- **Factual, specific content**: name technologies (n8n, Vapi, Supabase), quantify results in cases, state geography
- **Detailed case studies**: not "we helped a client" but "integrated AI voice agent for order confirmation, reduced processing time by 70%"

## Internationalization (i18n)

### Library: next-intl

Lightweight, App Router native.

### Routing

- `/uk` — Ukrainian (default locale)
- `/en` — English
- `/` — redirect to `/uk` (or detect via Accept-Language header in middleware)

### Language Switcher

- In Navbar, simple uk/en toggle
- Preserves scroll position on switch
- Updates URL without full page reload

### Content Management

- All texts in `i18n/uk.json` and `i18n/en.json`
- Components use `useTranslations()` hook — zero hardcoded text in JSX
- Each locale gets own `title`, `description`, OG tags via `generateMetadata()`
- `<link rel="alternate" hreflang="uk|en">` — automatic

## Component Migration

### Transferred as-is (minimal changes)

- Hero, Services, Cases, About, Testimonials, Contact — structure and styles preserved
- CSS files — transferred one-to-one
- Video backgrounds — `public/` assets unchanged

### Adapted

- Hardcoded text → `useTranslations()` hooks
- GSAP animations — work as Client Components (`"use client"`)
- Video loop logic from `App.tsx` → dedicated `VideoBackground` Client Component
- `react-hook-form` in Contact → Client Component

### New Components

- **FAQ** — Server Component, bilingual Q&A pairs, FAQPage JSON-LD
- **Footer** — Server Component, links, contacts, copyright
- **LanguageSwitcher** — Client Component in Navbar

### Component Architecture

| Component | Type | Reason |
|-----------|------|--------|
| Root Layout | Server | fonts, global styles |
| Locale Layout | Server | metadata, JSON-LD, Navbar, Footer |
| Navbar (shell) | Server | SEO links |
| LanguageSwitcher | Client | interactivity |
| Hero | Client | GSAP, video |
| VideoBackground | Client | video loop logic |
| Services | Client | GSAP animations |
| Cases | Client | GSAP animations |
| About | Client | GSAP animations |
| Testimonials | Client | GSAP animations |
| FAQ | Server | SEO-critical, pure HTML |
| Contact | Client | react-hook-form |
| Footer | Server | SEO links, contacts |

## Dependencies

### Add
- `next` — framework
- `next-intl` — i18n
- `@next/third-parties` (optional) — analytics

### Keep
- `react`, `react-dom` — already 19.x
- `gsap`, `@gsap/react` — animations
- `react-hook-form` — contact form

### Remove
- `vite`, `@vitejs/plugin-react` — replaced by Next.js
- `vite.config.ts`, `tsconfig.node.json` — Next.js has own config

## Out of Scope

- Blog / separate pages for cases (future iteration)
- Performance optimization (video compression, bundle splitting) — separate task
- Analytics integration — separate task
- Contact form backend — keep current behavior
