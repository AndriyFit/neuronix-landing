# Neuronix Landing — Редизайн головної сторінки

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Переробити головну сторінку neuronics.work/uk під Google Ads трафік — білий фон, фокус на OpenCart/Horoshop/Landing послугах, секція цін, Telegram як primary CTA.

**Architecture:** Повний редизайн існуючих компонентів без зміни routing та i18n структури. CSS-змінні в `variables.css` контролюють всю тему — змінюємо там один раз. Кожен компонент має власний CSS файл, зберігаємо цей патерн. Нові компоненти (`HowWeWork`, `Pricing`) додаються за тим же шаблоном.

**Tech Stack:** Next.js 15 (App Router), TypeScript, next-intl, GSAP, react-hook-form, CSS Modules (per-component CSS files)

---

## File Map

| Дія | Файл | Що міняється |
|-----|------|-------------|
| Modify | `src/styles/variables.css` | Dark → light CSS vars |
| Modify | `src/styles/global.css` | Прибрати noise overlay, dark body |
| Modify | `src/i18n/uk.json` | Весь контент під нову структуру |
| Modify | `src/i18n/en.json` | Паралельне оновлення EN |
| Modify | `src/app/[locale]/page.tsx` | Новий список компонентів |
| Modify | `src/components/Navbar.tsx` | Telegram CTA кнопка, оновлені nav items |
| Modify | `src/components/css/Navbar.css` | Білий navbar |
| Modify | `src/components/Hero.tsx` | Без відео, 2 CTA, білий |
| Modify | `src/components/css/Hero.css` | Білий hero |
| Modify | `src/components/Services.tsx` | 3 послуги: OpenCart/Horoshop/Landing |
| Modify | `src/components/css/Services.css` | Білі картки |
| Create | `src/components/HowWeWork.tsx` | Нова секція "4 кроки" |
| Create | `src/components/css/HowWeWork.css` | Стилі |
| Modify | `src/components/Cases.tsx` | Перепишемо як "Результати" (3 стат-картки) |
| Modify | `src/components/css/Cases.css` | Стилі результатів |
| Create | `src/components/Pricing.tsx` | Нова таблиця цін |
| Create | `src/components/css/Pricing.css` | Стилі |
| Modify | `src/components/FAQ.tsx` | Оновлений контент |
| Modify | `src/components/css/FAQ.css` | Білі стилі |
| Modify | `src/components/Contact.tsx` | Telegram primary, форма secondary |
| Modify | `src/components/css/Contact.css` | Білі стилі |
| Modify | `src/components/Footer.tsx` | Спрощений footer |
| Modify | `src/components/css/Footer.css` | Білі стилі |
| Delete | `src/components/VideoBackground.tsx` | Не потрібен |
| Delete | `src/styles/sections-video.css` | Не потрібен |
| Remove from page | `src/components/Testimonials.tsx` | Не використовується |

---

## Task 1: CSS Variables — dark → light

**Files:**
- Modify: `src/styles/variables.css`

- [ ] **Step 1: Замінити всі CSS змінні на light theme**

```css
/* src/styles/variables.css */
:root {
  --bg: #ffffff;
  --bg-secondary: #f8f9fc;
  --primary: #7C3AED;
  --secondary: #0F172A;
  --accent: #7C3AED;
  --text: #0F172A;
  --text-muted: #64748B;
  --border: #E2E8F0;
  --glass-bg: rgba(255, 255, 255, 0.8);
  --glass-border: rgba(124, 58, 237, 0.15);
  --glass-blur: blur(20px);
  --font-display: 'Syne', sans-serif;
  --font-body: 'Syne', sans-serif;

  /* Shadows */
  --shadow-card: 0 2px 16px rgba(15, 23, 42, 0.08), 0 1px 4px rgba(15, 23, 42, 0.04);
  --shadow-elevated: 0 8px 32px rgba(15, 23, 42, 0.12), 0 2px 8px rgba(15, 23, 42, 0.06);

  /* Gradients */
  --gradient-primary: linear-gradient(135deg, #7C3AED, #4F46E5);
  --gradient-text: linear-gradient(135deg, #7C3AED, #4F46E5);
}
```

- [ ] **Step 2: Оновити global.css — прибрати noise overlay і dark body**

```css
/* src/styles/global.css — замінити секції Reset і Base */
*, *::before, *::after {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

html {
  scroll-behavior: smooth;
  background: var(--bg);
  color: var(--text);
  font-family: var(--font-body);
  font-size: 16px;
  line-height: 1.6;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

body {
  overflow-x: hidden;
  min-height: 100vh;
  background: var(--bg);
}

/* body::after — прибрати весь блок noise texture */
```

Видалити блок `body::after { content: ''; ... background-image: url("data:image/svg+xml...") }` повністю.

Оновити h1, h2 щоб прибрати dark glow text-shadow:
```css
h1 {
  font-size: clamp(2.4rem, 5vw, 4rem);
}

h2 {
  font-size: clamp(1.8rem, 3.5vw, 2.8rem);
}
```

- [ ] **Step 3: Запустити build-перевірку**

```bash
cd /root/projects/neuronix-landing && npm run lint 2>&1 | tail -5
```

Очікується: no errors (або тільки pre-existing warnings).

---

## Task 2: Ukrainian content (uk.json)

**Files:**
- Modify: `src/i18n/uk.json`

- [ ] **Step 1: Оновити uk.json повністю**

```json
{
  "metadata": {
    "title": "Neuronix — Розробка сайтів, OpenCart, Horoshop, Лендінги",
    "description": "Розробка інтернет-магазинів на OpenCart та Horoshop, лендінги з нуля. Від $150. Консультація безкоштовно. Київ, Україна."
  },
  "nav": {
    "services": "Послуги",
    "results": "Результати",
    "pricing": "Ціни",
    "faq": "FAQ",
    "contact": "Контакт",
    "cta": "Написати в Telegram"
  },
  "hero": {
    "titleStart": "Сайти, магазини та ",
    "titleHighlight": "автоматизація",
    "titleEnd": " для бізнесу",
    "subtitle": "OpenCart, Horoshop, лендінги з нуля — від $150. Консультація безкоштовно.",
    "ctaPrimary": "Написати в Telegram",
    "ctaSecondary": "Залишити заявку",
    "telegramUrl": "https://t.me/neuronix_ua"
  },
  "services": {
    "title": "Наші послуги",
    "extra": "Також: голосові агенти, чат-боти, n8n автоматизація →",
    "items": [
      {
        "icon": "🛒",
        "title": "OpenCart",
        "description": "Розробка модулів, доопрацювання, сайти з нуля. Інтеграція з 1С, Rozetka, Prom, маркетплейсами.",
        "price": "від $250"
      },
      {
        "icon": "🏪",
        "title": "Horoshop",
        "description": "Налаштування магазину, кастомні рішення, інтеграції з CRM, 1С та службами доставки.",
        "price": "від $500"
      },
      {
        "icon": "🚀",
        "title": "Лендінги",
        "description": "Від простих до складних — з калькуляторами, анімацією та формами захоплення лідів.",
        "price": "від $150"
      }
    ]
  },
  "howWeWork": {
    "title": "Як ми працюємо",
    "steps": [
      {
        "number": "01",
        "title": "Заявка",
        "description": "Описуєш задачу в Telegram або через форму — без зайвих питань"
      },
      {
        "number": "02",
        "title": "Оцінка за 24 год",
        "description": "Дзвінок або чат, фіксуємо бюджет і терміни. Ніяких сюрпризів потім"
      },
      {
        "number": "03",
        "title": "Розробка",
        "description": "Регулярні апдейти, доступ до тестового середовища на кожному етапі"
      },
      {
        "number": "04",
        "title": "Здача + підтримка",
        "description": "Здаємо з документацією і не зникаємо — підтримка після запуску включена"
      }
    ]
  },
  "results": {
    "title": "Результати",
    "items": [
      {
        "label": "E-commerce",
        "metric": "15,000+",
        "description": "товарів синхронізовано між 1С і OpenCart для Abertime"
      },
      {
        "label": "Лендінг",
        "metric": "5 днів",
        "description": "від брифу до запуску рекламного лендінгу для БК Трембіта"
      },
      {
        "label": "Автоматизація",
        "metric": "30 сек",
        "description": "замість 30 хвилин — автоматична генерація банерів для Abertime"
      }
    ]
  },
  "pricing": {
    "title": "Ціни",
    "note": "Точна вартість після обговорення задачі",
    "cta": "Обговорити задачу",
    "items": [
      { "service": "OpenCart — модуль або правки", "price": "від $250" },
      { "service": "OpenCart — сайт з нуля", "price": "від $700" },
      { "service": "Horoshop — налаштування та інтеграція", "price": "від $500" },
      { "service": "Лендінг простий", "price": "від $150" },
      { "service": "Лендінг з калькулятором / анімацією", "price": "від $400" }
    ]
  },
  "faq": {
    "title": "Питання та відповіді",
    "items": [
      {
        "question": "Скільки часу займає розробка?",
        "answer": "Простий лендінг — 3–5 днів. Модуль OpenCart — 3–7 днів. Сайт з нуля на OpenCart/Horoshop — від 2 тижнів. Точні терміни обговорюємо після брифу."
      },
      {
        "question": "Що входить в підтримку після здачі?",
        "answer": "Перший місяць — безкоштовні правки і консультації. Далі — за домовленістю. Не зникаємо після оплати."
      },
      {
        "question": "Чи працюєте з готовими сайтами на OpenCart/Horoshop?",
        "answer": "Так, це більшість наших задач. Беремо сайт будь-якого стану — доробляємо, виправляємо, інтегруємо."
      },
      {
        "question": "Як відбувається оплата?",
        "answer": "50% передоплата, 50% після здачі. Для великих проєктів — поетапна оплата по milestone."
      },
      {
        "question": "Що якщо мені потрібно щось нестандартне?",
        "answer": "Напишіть в Telegram — обговоримо. Ми робили інтеграції з Vapi, Binotel, SalesDrive, KeyCRM. Швидше за все вже вміємо."
      }
    ]
  },
  "contact": {
    "title": "Розкажіть про задачу",
    "subtitle": "Відповідаємо протягом години в робочий час",
    "telegramLabel": "Написати в Telegram",
    "telegramUrl": "https://t.me/neuronix_ua",
    "orLabel": "або заповніть форму",
    "form": {
      "name": "Ваше ім'я",
      "phone": "Телефон або email",
      "message": "Коротко про задачу",
      "submit": "Надіслати заявку",
      "submitting": "Надсилаємо...",
      "success": "Дякуємо! Зв'яжемося з вами протягом години.",
      "error": "Помилка. Напишіть нам напряму в Telegram.",
      "errorName": "Введіть ім'я",
      "errorPhone": "Введіть телефон або email"
    }
  },
  "footer": {
    "copy": "© 2025 Neuronix. Всі права захищені.",
    "telegram": "Telegram"
  }
}
```

- [ ] **Step 2: Оновити en.json паралельно**

Повторити ту ж структуру англійською. Ключові зміни:
- `nav.cta`: `"Message on Telegram"`
- `hero.titleStart`: `"Websites, stores and "`, `hero.titleHighlight`: `"automation"`, `hero.titleEnd`: `" for business"`
- `hero.subtitle`: `"OpenCart, Horoshop, landing pages from scratch — from $150. Free consultation."`
- Всі інші поля — точний переклад uk.json

---

## Task 3: Navbar — Telegram CTA + оновлені пункти меню

**Files:**
- Modify: `src/components/Navbar.tsx`
- Modify: `src/components/css/Navbar.css`

- [ ] **Step 1: Оновити Navbar.tsx**

Замінити `NAV_ITEMS` і додати Telegram href замість scrollTo для CTA:

```tsx
'use client'

import { useState, useEffect, useCallback } from 'react'
import { useTranslations } from 'next-intl'
import gsap from 'gsap'
import LanguageSwitcher from './LanguageSwitcher'
import './css/Navbar.css'

export default function Navbar() {
  const t = useTranslations('nav')
  const NAV_ITEMS = [
    { label: t('services'), id: 'services' },
    { label: t('results'), id: 'results' },
    { label: t('pricing'), id: 'pricing' },
    { label: t('faq'), id: 'faq' },
    { label: t('contact'), id: 'contact' },
  ]

  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('.navbar', { y: -60, opacity: 0, duration: 0.8, ease: 'power3.out', delay: 0.2 })
    })
    return () => ctx.revert()
  }, [])

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [mobileOpen])

  const scrollTo = useCallback((id: string) => {
    setMobileOpen(false)
    document.querySelector(`#${id}`)?.scrollIntoView({ behavior: 'smooth' })
  }, [])

  return (
    <>
      <nav className={`navbar${scrolled ? ' scrolled' : ''}`}>
        <div className="navbar-logo" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
          NEURONIX
        </div>

        <ul className="navbar-links">
          {NAV_ITEMS.map((item) => (
            <li key={item.id}>
              <a href={`#${item.id}`} onClick={(e) => { e.preventDefault(); scrollTo(item.id) }}>
                {item.label}
              </a>
            </li>
          ))}
        </ul>

        <a
          href={t('telegramUrl')}
          className="navbar-cta navbar-cta-desktop"
          target="_blank"
          rel="noopener noreferrer"
        >
          {t('cta')}
        </a>
        <LanguageSwitcher />

        <button
          className={`navbar-burger${mobileOpen ? ' open' : ''}`}
          onClick={() => setMobileOpen((v) => !v)}
          aria-label="Menu"
        >
          <span /><span /><span />
        </button>
      </nav>

      <ul className={`navbar-mobile${mobileOpen ? ' open' : ''}`}>
        {NAV_ITEMS.map((item) => (
          <li key={item.id}>
            <a href={`#${item.id}`} onClick={(e) => { e.preventDefault(); scrollTo(item.id) }}>
              {item.label}
            </a>
          </li>
        ))}
        <li>
          <a href={t('telegramUrl')} className="navbar-cta" target="_blank" rel="noopener noreferrer">
            {t('cta')}
          </a>
        </li>
        <li><LanguageSwitcher /></li>
      </ul>
    </>
  )
}
```

Увага: `t('telegramUrl')` не існує в `nav` — додати в uk.json:
```json
"nav": {
  ...,
  "telegramUrl": "https://t.me/neuronix_ua"
}
```

- [ ] **Step 2: Оновити Navbar.css**

```css
/* src/components/css/Navbar.css */
.navbar {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 100;
  display: flex;
  align-items: center;
  gap: 2rem;
  padding: 0 2rem;
  height: 64px;
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border-bottom: 1px solid transparent;
  transition: border-color 0.3s, box-shadow 0.3s;
}

.navbar.scrolled {
  border-bottom-color: var(--border);
  box-shadow: 0 2px 16px rgba(15, 23, 42, 0.06);
}

.navbar-logo {
  font-family: var(--font-display);
  font-weight: 800;
  font-size: 1.25rem;
  color: var(--text);
  cursor: pointer;
  letter-spacing: 0.05em;
  flex-shrink: 0;
}

.navbar-links {
  display: flex;
  list-style: none;
  gap: 0.25rem;
  margin-left: auto;
}

.navbar-links a {
  display: block;
  padding: 0.4rem 0.75rem;
  font-size: 0.875rem;
  font-weight: 500;
  color: var(--text-muted);
  text-decoration: none;
  border-radius: 6px;
  transition: color 0.2s, background 0.2s;
}

.navbar-links a:hover {
  color: var(--text);
  background: var(--bg-secondary);
}

.navbar-cta {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1.125rem;
  background: var(--primary);
  color: #fff;
  font-size: 0.875rem;
  font-weight: 600;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  text-decoration: none;
  white-space: nowrap;
  transition: background 0.2s, transform 0.15s;
  flex-shrink: 0;
}

.navbar-cta:hover {
  background: #6D28D9;
  transform: translateY(-1px);
}

.navbar-burger {
  display: none;
  flex-direction: column;
  justify-content: center;
  gap: 5px;
  width: 32px;
  height: 32px;
  background: none;
  border: none;
  cursor: pointer;
  padding: 4px;
}

.navbar-burger span {
  display: block;
  width: 100%;
  height: 2px;
  background: var(--text);
  border-radius: 2px;
  transition: transform 0.2s, opacity 0.2s;
}

.navbar-burger.open span:nth-child(1) { transform: translateY(7px) rotate(45deg); }
.navbar-burger.open span:nth-child(2) { opacity: 0; }
.navbar-burger.open span:nth-child(3) { transform: translateY(-7px) rotate(-45deg); }

.navbar-mobile {
  display: none;
  position: fixed;
  inset: 64px 0 0 0;
  z-index: 99;
  background: #fff;
  list-style: none;
  flex-direction: column;
  padding: 1rem 1.5rem;
  gap: 0.25rem;
  border-top: 1px solid var(--border);
  overflow-y: auto;
}

.navbar-mobile.open { display: flex; }

.navbar-mobile a, .navbar-mobile button {
  display: block;
  padding: 0.75rem 0;
  font-size: 1rem;
  font-weight: 500;
  color: var(--text);
  text-decoration: none;
  border: none;
  background: none;
  cursor: pointer;
  width: 100%;
  text-align: left;
  border-bottom: 1px solid var(--border);
}

.navbar-mobile .navbar-cta {
  margin-top: 0.5rem;
  border-radius: 8px;
  text-align: center;
  justify-content: center;
  border-bottom: none;
}

@media (max-width: 768px) {
  .navbar-links, .navbar-cta-desktop { display: none; }
  .navbar-burger { display: flex; }
}
```

---

## Task 4: Hero — білий, без відео, 2 CTA

**Files:**
- Modify: `src/components/Hero.tsx`
- Modify: `src/components/css/Hero.css`

- [ ] **Step 1: Переписати Hero.tsx**

```tsx
'use client'
import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { useTranslations } from 'next-intl'
import './css/Hero.css'

export default function Hero() {
  const contentRef = useRef<HTMLDivElement>(null)
  const t = useTranslations('hero')

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('.hero-badge, .hero-title, .hero-subtitle, .hero-actions', {
        y: 30,
        opacity: 0,
        duration: 0.7,
        stagger: 0.12,
        ease: 'power3.out',
        delay: 0.2,
      })
    }, contentRef)
    return () => ctx.revert()
  }, [])

  const scrollToContact = () => {
    document.querySelector('#contact')?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <section className="hero" id="hero">
      <div className="hero-content" ref={contentRef}>
        <span className="hero-badge">neuronix.work</span>
        <h1 className="hero-title">
          {t('titleStart')}
          <span className="hero-title-highlight">{t('titleHighlight')}</span>
          {t('titleEnd')}
        </h1>
        <p className="hero-subtitle">{t('subtitle')}</p>
        <div className="hero-actions">
          <a
            href={t('telegramUrl')}
            className="hero-cta-primary"
            target="_blank"
            rel="noopener noreferrer"
          >
            {t('ctaPrimary')}
          </a>
          <button className="hero-cta-secondary" onClick={scrollToContact}>
            {t('ctaSecondary')}
          </button>
        </div>
      </div>

      <div className="hero-visual">
        <div className="hero-mockup">
          <div className="mockup-bar">
            <span className="mockup-dot" />
            <span className="mockup-dot" />
            <span className="mockup-dot" />
            <span className="mockup-url">neuronics.work</span>
          </div>
          <div className="mockup-body">
            <div className="mockup-nav-line" />
            <div className="mockup-hero-block">
              <div className="mockup-line wide" />
              <div className="mockup-line medium" />
              <div className="mockup-btn-mock" />
            </div>
            <div className="mockup-cards">
              <div className="mockup-card-item" />
              <div className="mockup-card-item" />
              <div className="mockup-card-item" />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
```

- [ ] **Step 2: Переписати Hero.css**

```css
/* src/components/css/Hero.css */
.hero {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 4rem;
  padding: 96px 2rem 4rem;
  max-width: 1200px;
  margin: 0 auto;
}

.hero-content {
  flex: 1;
  max-width: 560px;
}

.hero-badge {
  display: inline-block;
  padding: 0.25rem 0.75rem;
  background: #EDE9FE;
  color: var(--primary);
  font-size: 0.8rem;
  font-weight: 600;
  border-radius: 20px;
  margin-bottom: 1.25rem;
  letter-spacing: 0.03em;
}

.hero-title {
  font-size: clamp(2.2rem, 4.5vw, 3.5rem);
  font-weight: 800;
  color: var(--text);
  line-height: 1.15;
  margin-bottom: 1.25rem;
}

.hero-title-highlight {
  color: var(--primary);
}

.hero-subtitle {
  font-size: clamp(1rem, 2vw, 1.2rem);
  color: var(--text-muted);
  line-height: 1.6;
  margin-bottom: 2rem;
}

.hero-actions {
  display: flex;
  gap: 0.75rem;
  flex-wrap: wrap;
}

.hero-cta-primary {
  display: inline-flex;
  align-items: center;
  padding: 0.875rem 1.75rem;
  background: var(--primary);
  color: #fff;
  font-size: 1rem;
  font-weight: 600;
  border-radius: 10px;
  text-decoration: none;
  transition: background 0.2s, transform 0.15s;
}

.hero-cta-primary:hover {
  background: #6D28D9;
  transform: translateY(-2px);
}

.hero-cta-secondary {
  display: inline-flex;
  align-items: center;
  padding: 0.875rem 1.75rem;
  background: transparent;
  color: var(--text);
  font-size: 1rem;
  font-weight: 500;
  border: 1.5px solid var(--border);
  border-radius: 10px;
  cursor: pointer;
  transition: border-color 0.2s, background 0.2s;
}

.hero-cta-secondary:hover {
  border-color: var(--primary);
  background: #F5F3FF;
}

/* Mockup */
.hero-visual {
  flex: 1;
  display: flex;
  justify-content: center;
  max-width: 480px;
}

.hero-mockup {
  width: 100%;
  max-width: 420px;
  background: #fff;
  border-radius: 12px;
  box-shadow: var(--shadow-elevated);
  border: 1px solid var(--border);
  overflow: hidden;
}

.mockup-bar {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 10px 14px;
  background: var(--bg-secondary);
  border-bottom: 1px solid var(--border);
}

.mockup-dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: var(--border);
}

.mockup-url {
  margin-left: 8px;
  font-size: 0.75rem;
  color: var(--text-muted);
  background: #fff;
  padding: 2px 8px;
  border-radius: 4px;
  border: 1px solid var(--border);
}

.mockup-body {
  padding: 1rem;
}

.mockup-nav-line {
  height: 8px;
  background: var(--border);
  border-radius: 4px;
  margin-bottom: 1rem;
}

.mockup-hero-block {
  background: var(--bg-secondary);
  border-radius: 8px;
  padding: 1.25rem;
  margin-bottom: 1rem;
}

.mockup-line {
  height: 10px;
  background: var(--border);
  border-radius: 4px;
  margin-bottom: 8px;
}

.mockup-line.wide { width: 85%; }
.mockup-line.medium { width: 60%; }

.mockup-btn-mock {
  width: 100px;
  height: 28px;
  background: var(--primary);
  border-radius: 6px;
  opacity: 0.7;
  margin-top: 4px;
}

.mockup-cards {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 8px;
}

.mockup-card-item {
  height: 60px;
  background: var(--bg-secondary);
  border-radius: 6px;
  border: 1px solid var(--border);
}

@media (max-width: 900px) {
  .hero {
    flex-direction: column;
    min-height: auto;
    padding-top: 80px;
    text-align: center;
  }
  .hero-actions { justify-content: center; }
  .hero-visual { width: 100%; }
}
```

---

## Task 5: Services — 3 картки з ціною

**Files:**
- Modify: `src/components/Services.tsx`
- Modify: `src/components/css/Services.css`

- [ ] **Step 1: Переписати Services.tsx**

```tsx
'use client'
import { useEffect, useRef } from 'react'
import { useTranslations } from 'next-intl'
import './css/Services.css'

export default function Services() {
  const sectionRef = useRef<HTMLElement>(null)
  const t = useTranslations('services')
  const items = t.raw('items') as Array<{
    icon: string
    title: string
    description: string
    price: string
  }>

  useEffect(() => {
    if (!sectionRef.current) return
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible')
            observer.unobserve(entry.target)
          }
        })
      },
      { threshold: 0.1 }
    )
    sectionRef.current.querySelectorAll('.animate-in').forEach((el) => observer.observe(el))
    return () => observer.disconnect()
  }, [])

  const scrollToContact = () => {
    document.querySelector('#contact')?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <section id="services" className="services" ref={sectionRef}>
      <div className="services-inner">
        <h2 className="services-title animate-in">{t('title')}</h2>
        <div className="services-grid">
          {items.map((item, i) => (
            <div
              className="service-card animate-in"
              key={item.title}
              style={{ transitionDelay: `${i * 0.1}s` }}
            >
              <span className="service-icon">{item.icon}</span>
              <h3 className="service-card-title">{item.title}</h3>
              <p className="service-card-desc">{item.description}</p>
              <div className="service-card-footer">
                <span className="service-price">{item.price}</span>
                <button className="service-cta" onClick={scrollToContact}>
                  Дізнатись більше
                </button>
              </div>
            </div>
          ))}
        </div>
        <p className="services-extra animate-in">{t('extra')}</p>
      </div>
    </section>
  )
}
```

- [ ] **Step 2: Переписати Services.css**

```css
/* src/components/css/Services.css */
.services {
  background: var(--bg-secondary);
  padding: 5rem 2rem;
}

.services-inner {
  max-width: 1100px;
  margin: 0 auto;
}

.services-title {
  text-align: center;
  margin-bottom: 3rem;
  color: var(--text);
  opacity: 0;
  transform: translateY(20px);
  transition: opacity 0.6s, transform 0.6s;
}

.services-title.visible { opacity: 1; transform: none; }

.services-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1.5rem;
}

.service-card {
  background: #fff;
  border-radius: 16px;
  padding: 2rem;
  border: 1px solid var(--border);
  box-shadow: var(--shadow-card);
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  opacity: 0;
  transform: translateY(24px);
  transition: opacity 0.5s, transform 0.5s, box-shadow 0.2s;
}

.service-card.visible { opacity: 1; transform: none; }

.service-card:hover {
  box-shadow: var(--shadow-elevated);
  transform: translateY(-2px);
}

.service-icon { font-size: 2rem; }

.service-card-title {
  font-size: 1.25rem;
  font-weight: 700;
  color: var(--text);
}

.service-card-desc {
  font-size: 0.9rem;
  color: var(--text-muted);
  line-height: 1.6;
  flex: 1;
}

.service-card-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 0.5rem;
  padding-top: 1rem;
  border-top: 1px solid var(--border);
}

.service-price {
  font-size: 0.95rem;
  font-weight: 700;
  color: var(--primary);
}

.service-cta {
  font-size: 0.8rem;
  font-weight: 600;
  color: var(--primary);
  background: none;
  border: none;
  cursor: pointer;
  padding: 0;
  text-decoration: underline;
  text-underline-offset: 2px;
}

.services-extra {
  text-align: center;
  margin-top: 2rem;
  font-size: 0.9rem;
  color: var(--text-muted);
  opacity: 0;
  transform: translateY(10px);
  transition: opacity 0.5s, transform 0.5s;
}

.services-extra.visible { opacity: 1; transform: none; }

@media (max-width: 900px) {
  .services-grid { grid-template-columns: 1fr; }
}

@media (min-width: 600px) and (max-width: 900px) {
  .services-grid { grid-template-columns: repeat(2, 1fr); }
}
```

---

## Task 6: HowWeWork — 4 кроки

**Files:**
- Create: `src/components/HowWeWork.tsx`
- Create: `src/components/css/HowWeWork.css`

- [ ] **Step 1: Створити HowWeWork.tsx**

```tsx
'use client'
import { useEffect, useRef } from 'react'
import { useTranslations } from 'next-intl'
import './css/HowWeWork.css'

export default function HowWeWork() {
  const sectionRef = useRef<HTMLElement>(null)
  const t = useTranslations('howWeWork')
  const steps = t.raw('steps') as Array<{ number: string; title: string; description: string }>

  useEffect(() => {
    if (!sectionRef.current) return
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible')
            observer.unobserve(entry.target)
          }
        })
      },
      { threshold: 0.1 }
    )
    sectionRef.current.querySelectorAll('.animate-in').forEach((el) => observer.observe(el))
    return () => observer.disconnect()
  }, [])

  return (
    <section id="how-we-work" className="how-we-work" ref={sectionRef}>
      <div className="how-we-work-inner">
        <h2 className="how-we-work-title animate-in">{t('title')}</h2>
        <div className="steps-grid">
          {steps.map((step, i) => (
            <div
              className="step-card animate-in"
              key={step.number}
              style={{ transitionDelay: `${i * 0.1}s` }}
            >
              <span className="step-number">{step.number}</span>
              <h3 className="step-title">{step.title}</h3>
              <p className="step-desc">{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
```

- [ ] **Step 2: Створити HowWeWork.css**

```css
/* src/components/css/HowWeWork.css */
.how-we-work {
  padding: 5rem 2rem;
  background: var(--bg);
}

.how-we-work-inner {
  max-width: 1100px;
  margin: 0 auto;
}

.how-we-work-title {
  text-align: center;
  margin-bottom: 3rem;
  color: var(--text);
  opacity: 0;
  transform: translateY(20px);
  transition: opacity 0.6s, transform 0.6s;
}

.how-we-work-title.visible { opacity: 1; transform: none; }

.steps-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1.5rem;
  position: relative;
}

.steps-grid::before {
  content: '';
  position: absolute;
  top: 2rem;
  left: 2rem;
  right: 2rem;
  height: 2px;
  background: linear-gradient(90deg, var(--primary), transparent);
  opacity: 0.15;
  pointer-events: none;
}

.step-card {
  padding: 1.75rem;
  opacity: 0;
  transform: translateY(24px);
  transition: opacity 0.5s, transform 0.5s;
}

.step-card.visible { opacity: 1; transform: none; }

.step-number {
  display: block;
  font-size: 2.5rem;
  font-weight: 800;
  color: var(--primary);
  opacity: 0.25;
  line-height: 1;
  margin-bottom: 0.75rem;
}

.step-title {
  font-size: 1.1rem;
  font-weight: 700;
  color: var(--text);
  margin-bottom: 0.5rem;
}

.step-desc {
  font-size: 0.875rem;
  color: var(--text-muted);
  line-height: 1.6;
}

@media (max-width: 900px) {
  .steps-grid { grid-template-columns: repeat(2, 1fr); }
  .steps-grid::before { display: none; }
}

@media (max-width: 480px) {
  .steps-grid { grid-template-columns: 1fr; }
}
```

---

## Task 7: Results — перепис Cases як мінімальні стат-картки

**Files:**
- Modify: `src/components/Cases.tsx`
- Modify: `src/components/css/Cases.css`

- [ ] **Step 1: Переписати Cases.tsx**

```tsx
'use client'
import { useEffect, useRef } from 'react'
import { useTranslations } from 'next-intl'
import './css/Cases.css'

export default function Cases() {
  const sectionRef = useRef<HTMLElement>(null)
  const t = useTranslations('results')
  const items = t.raw('items') as Array<{ label: string; metric: string; description: string }>

  useEffect(() => {
    if (!sectionRef.current) return
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible')
            observer.unobserve(entry.target)
          }
        })
      },
      { threshold: 0.1 }
    )
    sectionRef.current.querySelectorAll('.animate-in').forEach((el) => observer.observe(el))
    return () => observer.disconnect()
  }, [])

  return (
    <section id="results" className="results" ref={sectionRef}>
      <div className="results-inner">
        <h2 className="results-title animate-in">{t('title')}</h2>
        <div className="results-grid">
          {items.map((item, i) => (
            <div
              className="result-card animate-in"
              key={item.label}
              style={{ transitionDelay: `${i * 0.1}s` }}
            >
              <span className="result-label">{item.label}</span>
              <span className="result-metric">{item.metric}</span>
              <p className="result-desc">{item.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
```

- [ ] **Step 2: Переписати Cases.css**

```css
/* src/components/css/Cases.css */
.results {
  background: var(--bg-secondary);
  padding: 5rem 2rem;
}

.results-inner {
  max-width: 1100px;
  margin: 0 auto;
}

.results-title {
  text-align: center;
  margin-bottom: 3rem;
  color: var(--text);
  opacity: 0;
  transform: translateY(20px);
  transition: opacity 0.6s, transform 0.6s;
}

.results-title.visible { opacity: 1; transform: none; }

.results-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1.5rem;
}

.result-card {
  background: #fff;
  border-radius: 16px;
  padding: 2rem;
  border: 1px solid var(--border);
  box-shadow: var(--shadow-card);
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  opacity: 0;
  transform: translateY(24px);
  transition: opacity 0.5s, transform 0.5s;
}

.result-card.visible { opacity: 1; transform: none; }

.result-label {
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: var(--primary);
  opacity: 0.8;
}

.result-metric {
  font-size: 2.5rem;
  font-weight: 800;
  color: var(--text);
  line-height: 1.1;
}

.result-desc {
  font-size: 0.875rem;
  color: var(--text-muted);
  line-height: 1.5;
}

@media (max-width: 768px) {
  .results-grid { grid-template-columns: 1fr; }
}

@media (min-width: 580px) and (max-width: 768px) {
  .results-grid { grid-template-columns: repeat(2, 1fr); }
}
```

---

## Task 8: Pricing — нова таблиця цін

**Files:**
- Create: `src/components/Pricing.tsx`
- Create: `src/components/css/Pricing.css`

- [ ] **Step 1: Створити Pricing.tsx**

```tsx
'use client'
import { useEffect, useRef } from 'react'
import { useTranslations } from 'next-intl'
import './css/Pricing.css'

export default function Pricing() {
  const sectionRef = useRef<HTMLElement>(null)
  const t = useTranslations('pricing')
  const items = t.raw('items') as Array<{ service: string; price: string }>

  useEffect(() => {
    if (!sectionRef.current) return
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible')
            observer.unobserve(entry.target)
          }
        })
      },
      { threshold: 0.1 }
    )
    sectionRef.current.querySelectorAll('.animate-in').forEach((el) => observer.observe(el))
    return () => observer.disconnect()
  }, [])

  const scrollToContact = () => {
    document.querySelector('#contact')?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <section id="pricing" className="pricing" ref={sectionRef}>
      <div className="pricing-inner">
        <h2 className="pricing-title animate-in">{t('title')}</h2>
        <div className="pricing-table animate-in">
          {items.map((item, i) => (
            <div className="pricing-row" key={i}>
              <span className="pricing-service">{item.service}</span>
              <span className="pricing-price">{item.price}</span>
            </div>
          ))}
        </div>
        <p className="pricing-note animate-in">{t('note')}</p>
        <div className="pricing-cta animate-in">
          <button className="pricing-cta-btn" onClick={scrollToContact}>
            {t('cta')}
          </button>
        </div>
      </div>
    </section>
  )
}
```

- [ ] **Step 2: Створити Pricing.css**

```css
/* src/components/css/Pricing.css */
.pricing {
  padding: 5rem 2rem;
  background: var(--bg);
}

.pricing-inner {
  max-width: 640px;
  margin: 0 auto;
}

.pricing-title {
  text-align: center;
  margin-bottom: 2.5rem;
  color: var(--text);
  opacity: 0;
  transform: translateY(20px);
  transition: opacity 0.6s, transform 0.6s;
}

.pricing-title.visible { opacity: 1; transform: none; }

.pricing-table {
  background: #fff;
  border-radius: 16px;
  border: 1px solid var(--border);
  box-shadow: var(--shadow-card);
  overflow: hidden;
  opacity: 0;
  transform: translateY(24px);
  transition: opacity 0.6s, transform 0.6s;
}

.pricing-table.visible { opacity: 1; transform: none; }

.pricing-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.1rem 1.5rem;
  border-bottom: 1px solid var(--border);
  gap: 1rem;
}

.pricing-row:last-child { border-bottom: none; }

.pricing-row:hover { background: var(--bg-secondary); }

.pricing-service {
  font-size: 0.9rem;
  color: var(--text);
}

.pricing-price {
  font-size: 0.95rem;
  font-weight: 700;
  color: var(--primary);
  white-space: nowrap;
}

.pricing-note {
  text-align: center;
  margin-top: 1rem;
  font-size: 0.8rem;
  color: var(--text-muted);
  opacity: 0;
  transition: opacity 0.5s 0.2s;
}

.pricing-note.visible { opacity: 1; }

.pricing-cta {
  text-align: center;
  margin-top: 2rem;
  opacity: 0;
  transform: translateY(10px);
  transition: opacity 0.5s 0.3s, transform 0.5s 0.3s;
}

.pricing-cta.visible { opacity: 1; transform: none; }

.pricing-cta-btn {
  padding: 0.875rem 2rem;
  background: var(--primary);
  color: #fff;
  font-size: 1rem;
  font-weight: 600;
  border: none;
  border-radius: 10px;
  cursor: pointer;
  transition: background 0.2s, transform 0.15s;
}

.pricing-cta-btn:hover {
  background: #6D28D9;
  transform: translateY(-2px);
}
```

---

## Task 9: FAQ — оновлений контент

**Files:**
- Modify: `src/components/css/FAQ.css` (тільки кольори)

- [ ] **Step 1: Оновити FAQ.css — dark → light кольори**

Знайти і замінити: `color: var(--text)` вже правильно після оновлення variables.css.
Перевірити що немає хардкодних dark кольорів:

```bash
grep -n "#050510\|#0a0a1e\|rgba(0,0,0\|glass-bg\|glass-border" \
  /root/projects/neuronix-landing/src/components/css/FAQ.css
```

Якщо є — замінити на `var(--bg)`, `var(--border)`, `var(--text)`.

FAQ.tsx код не чіпаємо — він вже читає з `t.raw('items')` і рендерить динамічно. Контент оновлено через uk.json в Task 2.

---

## Task 10: Contact — Telegram primary, форма secondary

**Files:**
- Modify: `src/components/Contact.tsx`
- Modify: `src/components/css/Contact.css`

- [ ] **Step 1: Оновити Contact.tsx — додати Telegram кнопку над формою**

```tsx
'use client'

import { useEffect, useRef, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useTranslations } from 'next-intl'
import './css/Contact.css'

interface FormData {
  name: string
  phone: string
  message: string
}

export default function Contact() {
  const sectionRef = useRef<HTMLElement>(null)
  const [submitted, setSubmitted] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)
  const t = useTranslations('contact')

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormData>()

  useEffect(() => {
    if (!sectionRef.current) return
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible')
            observer.unobserve(entry.target)
          }
        })
      },
      { threshold: 0.1 }
    )
    sectionRef.current.querySelectorAll('.animate-in').forEach((el) => observer.observe(el))
    return () => observer.disconnect()
  }, [])

  const onSubmit = async (data: FormData) => {
    setSubmitError(null)
    try {
      const res = await fetch(process.env.NEXT_PUBLIC_WEBHOOK_URL!, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...data, source: 'landing_v3' }),
      })
      if (!res.ok) throw new Error('Server error')
      setSubmitted(true)
      reset()
      setTimeout(() => setSubmitted(false), 5000)
    } catch {
      setSubmitError(t('form.error'))
    }
  }

  return (
    <section id="contact" className="contact" ref={sectionRef}>
      <div className="contact-inner">
        <h2 className="contact-title animate-in">{t('title')}</h2>
        <p className="contact-subtitle animate-in">{t('subtitle')}</p>

        <div className="contact-telegram animate-in">
          <a
            href={t('telegramUrl')}
            className="contact-telegram-btn"
            target="_blank"
            rel="noopener noreferrer"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/>
            </svg>
            {t('telegramLabel')}
          </a>
        </div>

        <p className="contact-or animate-in">{t('orLabel')}</p>

        <form className="contact-form animate-in" onSubmit={handleSubmit(onSubmit)} noValidate>
          <div className="contact-field">
            <input
              type="text"
              className={`contact-input${errors.name ? ' error' : ''}`}
              placeholder={t('form.name')}
              {...register('name', { required: t('form.errorName') })}
            />
            {errors.name && <span className="contact-error">{errors.name.message}</span>}
          </div>

          <div className="contact-field">
            <input
              type="text"
              className={`contact-input${errors.phone ? ' error' : ''}`}
              placeholder={t('form.phone')}
              {...register('phone', { required: t('form.errorPhone') })}
            />
            {errors.phone && <span className="contact-error">{errors.phone.message}</span>}
          </div>

          <div className="contact-field">
            <textarea
              className="contact-input contact-textarea"
              placeholder={t('form.message')}
              rows={4}
              {...register('message')}
            />
          </div>

          <button type="submit" className="contact-submit" disabled={isSubmitting}>
            {isSubmitting ? t('form.submitting') : t('form.submit')}
          </button>

          {submitted && <div className="contact-success">{t('form.success')}</div>}
          {submitError && <div className="contact-error-msg">{submitError}</div>}
        </form>
      </div>
    </section>
  )
}
```

- [ ] **Step 2: Переписати Contact.css**

```css
/* src/components/css/Contact.css */
.contact {
  padding: 5rem 2rem;
  background: var(--bg-secondary);
}

.contact-inner {
  max-width: 520px;
  margin: 0 auto;
  text-align: center;
}

.contact-title {
  color: var(--text);
  margin-bottom: 0.75rem;
  opacity: 0;
  transform: translateY(20px);
  transition: opacity 0.6s, transform 0.6s;
}

.contact-title.visible { opacity: 1; transform: none; }

.contact-subtitle {
  color: var(--text-muted);
  margin-bottom: 2rem;
  opacity: 0;
  transition: opacity 0.5s 0.1s;
}

.contact-subtitle.visible { opacity: 1; }

.contact-telegram {
  opacity: 0;
  transform: translateY(16px);
  transition: opacity 0.5s 0.15s, transform 0.5s 0.15s;
}

.contact-telegram.visible { opacity: 1; transform: none; }

.contact-telegram-btn {
  display: inline-flex;
  align-items: center;
  gap: 0.625rem;
  padding: 1rem 2rem;
  background: var(--primary);
  color: #fff;
  font-size: 1rem;
  font-weight: 600;
  border-radius: 12px;
  text-decoration: none;
  transition: background 0.2s, transform 0.15s;
}

.contact-telegram-btn:hover {
  background: #6D28D9;
  transform: translateY(-2px);
}

.contact-or {
  margin: 1.5rem 0;
  font-size: 0.875rem;
  color: var(--text-muted);
  position: relative;
  opacity: 0;
  transition: opacity 0.5s 0.2s;
}

.contact-or.visible { opacity: 1; }

.contact-or::before,
.contact-or::after {
  content: '';
  position: absolute;
  top: 50%;
  width: 35%;
  height: 1px;
  background: var(--border);
}

.contact-or::before { left: 0; }
.contact-or::after { right: 0; }

.contact-form {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  text-align: left;
  opacity: 0;
  transition: opacity 0.5s 0.25s;
}

.contact-form.visible { opacity: 1; }

.contact-field { display: flex; flex-direction: column; gap: 0.25rem; }

.contact-input {
  width: 100%;
  padding: 0.875rem 1rem;
  font-size: 0.95rem;
  font-family: var(--font-body);
  color: var(--text);
  background: #fff;
  border: 1.5px solid var(--border);
  border-radius: 10px;
  outline: none;
  transition: border-color 0.2s;
}

.contact-input:focus { border-color: var(--primary); }
.contact-input.error { border-color: #EF4444; }

.contact-textarea { resize: vertical; min-height: 100px; }

.contact-error {
  font-size: 0.8rem;
  color: #EF4444;
  margin-top: 2px;
}

.contact-submit {
  padding: 0.875rem;
  background: var(--primary);
  color: #fff;
  font-size: 1rem;
  font-weight: 600;
  border: none;
  border-radius: 10px;
  cursor: pointer;
  transition: background 0.2s;
}

.contact-submit:hover:not(:disabled) { background: #6D28D9; }
.contact-submit:disabled { opacity: 0.6; cursor: not-allowed; }

.contact-success {
  padding: 0.75rem 1rem;
  background: #F0FDF4;
  color: #16A34A;
  border-radius: 8px;
  font-size: 0.9rem;
  text-align: center;
  border: 1px solid #BBF7D0;
}

.contact-error-msg {
  padding: 0.75rem 1rem;
  background: #FEF2F2;
  color: #DC2626;
  border-radius: 8px;
  font-size: 0.9rem;
  text-align: center;
  border: 1px solid #FECACA;
}
```

---

## Task 11: Footer — спрощений

**Files:**
- Modify: `src/components/Footer.tsx`
- Modify: `src/components/css/Footer.css`

- [ ] **Step 1: Оновити Footer.tsx**

```tsx
import { useTranslations } from 'next-intl'
import './css/Footer.css'

export default function Footer() {
  const t = useTranslations('footer')
  return (
    <footer className="footer">
      <div className="footer-inner">
        <span className="footer-logo">NEURONIX</span>
        <span className="footer-copy">{t('copy')}</span>
        <a href="https://t.me/neuronix_ua" className="footer-tg" target="_blank" rel="noopener noreferrer">
          {t('telegram')}
        </a>
      </div>
    </footer>
  )
}
```

- [ ] **Step 2: Переписати Footer.css**

```css
/* src/components/css/Footer.css */
.footer {
  padding: 1.5rem 2rem;
  background: var(--bg);
  border-top: 1px solid var(--border);
}

.footer-inner {
  max-width: 1100px;
  margin: 0 auto;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  flex-wrap: wrap;
}

.footer-logo {
  font-weight: 800;
  font-size: 1rem;
  color: var(--text);
  letter-spacing: 0.05em;
}

.footer-copy {
  font-size: 0.8rem;
  color: var(--text-muted);
}

.footer-tg {
  font-size: 0.8rem;
  color: var(--primary);
  text-decoration: none;
  font-weight: 500;
}

.footer-tg:hover { text-decoration: underline; }
```

---

## Task 12: page.tsx — нова структура компонентів

**Files:**
- Modify: `src/app/[locale]/page.tsx`

- [ ] **Step 1: Замінити page.tsx**

```tsx
import Hero from '@/components/Hero'
import Services from '@/components/Services'
import HowWeWork from '@/components/HowWeWork'
import Cases from '@/components/Cases'
import Pricing from '@/components/Pricing'
import FAQ from '@/components/FAQ'
import Contact from '@/components/Contact'
import Footer from '@/components/Footer'

export default function HomePage() {
  return (
    <>
      <Hero />
      <Services />
      <HowWeWork />
      <Cases />
      <Pricing />
      <FAQ />
      <Contact />
      <Footer />
    </>
  )
}
```

Видалити `VideoBackground` і `Testimonials` з імпортів.

---

## Task 13: Cleanup — видалити невикористані файли

**Files:**
- Delete: `src/components/VideoBackground.tsx`
- Delete: `src/styles/sections-video.css`

- [ ] **Step 1: Перевірити що VideoBackground більше ніде не імпортується**

```bash
grep -r "VideoBackground\|sections-video" /root/projects/neuronix-landing/src/ --include="*.tsx" --include="*.ts" --include="*.css"
```

Очікується: нуль результатів після Task 12.

- [ ] **Step 2: Видалити файли**

```bash
rm /root/projects/neuronix-landing/src/components/VideoBackground.tsx
rm /root/projects/neuronix-landing/src/styles/sections-video.css
```

- [ ] **Step 3: Перевірити що sections-video.css не імпортується в layout**

```bash
grep -r "sections-video" /root/projects/neuronix-landing/src/
```

Якщо знайдено — прибрати import з layout.tsx.

---

## Task 14: Фінальна перевірка build

- [ ] **Step 1: TypeScript lint**

```bash
cd /root/projects/neuronix-landing && npm run lint 2>&1
```

Очікується: exit code 0, no errors.

- [ ] **Step 2: Production build**

```bash
cd /root/projects/neuronix-landing && npm run build 2>&1 | tail -30
```

Очікується: `✓ Compiled successfully` або `Route (app)` таблиця без помилок.

- [ ] **Step 3: Перевірити що uk та en локалі генеруються**

В output build мають бути рядки:
```
○ /uk
○ /en
```

---

## Checklist spec coverage

| Вимога з дизайн-спеку | Task |
|-----------------------|------|
| Білий фон, нуль темних елементів | Task 1 |
| Hero відповідає на запит OpenCart/Horoshop/Landing | Task 4 |
| 3 послуги з цінами | Task 5 |
| 4 кроки "Як ми працюємо" | Task 6 |
| 3 мінімальних результати | Task 7 |
| Таблиця цін видима | Task 8 |
| Telegram primary CTA скрізь | Tasks 3, 4, 10 |
| FAQ з ecom контентом | Task 2 (uk.json) |
| Форма + Telegram в Contact | Task 10 |
| Сайт збирається без TypeScript помилок | Task 14 |