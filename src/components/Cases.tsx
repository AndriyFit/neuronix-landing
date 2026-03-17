import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import './Cases.css'

gsap.registerPlugin(ScrollTrigger)

interface Metric {
  value: string
  label: string
  numeric: boolean
  numericTarget: number
  suffix: string
}

interface CaseData {
  tag: string
  tagColor: string
  title: string
  problem: string
  solution: string
  metrics: Metric[]
}

function parseMetric(value: string, label: string): Metric {
  const match = value.match(/^(\d+)(.*)$/)
  if (match && !/\//.test(value)) {
    return {
      value,
      label,
      numeric: true,
      numericTarget: parseInt(match[1], 10),
      suffix: match[2],
    }
  }
  return {
    value,
    label,
    numeric: false,
    numericTarget: 0,
    suffix: '',
  }
}

const CASES: CaseData[] = [
  {
    tag: 'E-Commerce',
    tagColor: '#00D4FF',
    title: 'Abertime — автоматизація каталогу годинників',
    problem: 'Оператори витрачали 5+ хвилин на додавання кожного товару: ручне заповнення OpenCart, 1С, FTP, написання описів двома мовами.',
    solution: 'Next.js адмін-панель + Fastify API (15 кроків) + AI-описи UA/RU (OpenRouter) + MySQL + 1С API + FTP автозавантаження фото',
    metrics: [
      parseMetric('30', 'сек замість 5 хв'),
      parseMetric('15', 'кроків автоматично'),
      parseMetric('0', 'помилок копіювання'),
    ],
  },
  {
    tag: 'Voice AI',
    tagColor: '#7B2FFF',
    title: 'Голосовий AI-агент для e-commerce',
    problem: 'Менеджери вручну обдзвонювали кожне замовлення для підтвердження — до 100+ дзвінків на день, пропуски у вихідні та ранковий час.',
    solution: 'Vapi голосовий агент з українською мовою + Cloudflare Workers + KeyCRM/SalesDrive API + автооновлення статусів + Telegram нотифікації',
    metrics: [
      parseMetric('90%', 'дзвінків без людей'),
      parseMetric('2', 'хв замість 15'),
      parseMetric('24/7', 'без вихідних'),
    ],
  },
  {
    tag: 'Analytics',
    tagColor: '#FF2D78',
    title: 'AI-аналітика якості дзвінків',
    problem: 'Контроль якості дзвінків — вручну, вибірково. Менеджери не дотримувались скриптів, проблеми виявлялись із запізненням.',
    solution: 'Cloudflare Workers + Deepgram транскрипція + 3 AI-агенти (класифікатор → методолог → суддя) + React дашборд з графіками',
    metrics: [
      parseMetric('100%', 'дзвінків аналізуються'),
      parseMetric('3', 'AI-агенти в pipeline'),
      parseMetric('0', 'пропущених порушень'),
    ],
  },
  {
    tag: 'CRM',
    tagColor: '#00E5FF',
    title: 'WaterDelivery — CRM для доставки води',
    problem: 'Замовлення з двох сайтів записувались в Excel і блокнот. Кур\'єри призначались вручну, баланс бутлів рахувався на папері.',
    solution: 'Next.js дашборд + Supabase + Horoshop webhook інтеграція (2 сайти) + авто-призначення кур\'єрів + баланси клієнтів',
    metrics: [
      parseMetric('3', 'год економії щодня'),
      parseMetric('2', 'сайти в одному вікні'),
      parseMetric('0', 'втрачених замовлень'),
    ],
  },
  {
    tag: 'AI Content',
    tagColor: '#FF6B35',
    title: 'Banner Automation — генерація акційних банерів',
    problem: 'Дизайнер витрачав 30+ хвилин на кожен банер: вирізав фото годинників, верстав ціни, знижки, терміни акцій вручну.',
    solution: 'Python + Pillow (auto-trim, компоновка) + FastAPI + n8n оркестрація + Telegram Bot для доставки готових банерів',
    metrics: [
      parseMetric('10', 'сек замість 30 хв'),
      parseMetric('0', 'роботи дизайнера'),
      parseMetric('100%', 'авто-генерація'),
    ],
  },
  {
    tag: 'Mini App',
    tagColor: '#9B59B6',
    title: 'WOD Champ — CrossFit трекер',
    problem: 'Тренери записували результати WOD у блокноти та Google Sheets. Атлети не бачили свого прогресу та особистих рекордів.',
    solution: 'Telegram Mini App (React + TypeScript) + Supabase + спільноти тренерів + PR трекінг + серії тренувань + calendar heatmap',
    metrics: [
      parseMetric('6', 'спільнот тренерів'),
      parseMetric('100%', 'історія результатів'),
      parseMetric('0', 'втрачених даних'),
    ],
  },
]

export default function Cases() {
  const sectionRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Title animation
      gsap.from('.cases-title', {
        scrollTrigger: {
          trigger: '.cases-title',
          start: 'top 90%',
          once: true,
        },
        y: 30,
        opacity: 0,
        duration: 0.6,
        ease: 'power3.out',
      })

      // Cards entrance from left with stagger
      gsap.from('.case-card', {
        scrollTrigger: {
          trigger: '.cases-grid',
          start: 'top 85%',
          once: true,
        },
        x: -80,
        opacity: 0,
        duration: 0.8,
        ease: 'power3.out',
        stagger: 0.15,
      })

      // Counter animation for numeric metrics
      const counters = document.querySelectorAll('.case-metric-value[data-numeric="true"]')
      counters.forEach((counter) => {
        const target = parseFloat(counter.getAttribute('data-target') || '0')
        const suffix = counter.getAttribute('data-suffix') || ''
        const el = counter as HTMLElement

        gsap.from(
          { val: 0 },
          {
            val: target,
            scrollTrigger: {
              trigger: counter,
              start: 'top 80%',
              once: true,
            },
            duration: 2,
            ease: 'power1.out',
            onUpdate: function () {
              const current = Math.round(this.targets()[0].val)
              el.textContent = current + suffix
            },
          }
        )
      })

      // Scale/opacity entrance for non-numeric metrics
      gsap.from('.case-metric-value[data-numeric="false"]', {
        scrollTrigger: {
          trigger: '.cases-grid',
          start: 'top 80%',
          once: true,
        },
        scale: 0.5,
        opacity: 0,
        duration: 0.8,
        ease: 'back.out(1.7)',
        stagger: 0.1,
      })
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  return (
    <section id="cases" className="cases" ref={sectionRef}>
      <h2 className="cases-title">Наші кейси</h2>
      <div className="cases-grid">
        {CASES.map((caseItem) => (
          <div className="case-card" key={caseItem.title}>
            <span
              className="case-tag"
              style={{
                background: `${caseItem.tagColor}20`,
                color: caseItem.tagColor,
                borderColor: `${caseItem.tagColor}40`,
                boxShadow: `0 0 12px ${caseItem.tagColor}4D`,
              }}
            >
              {caseItem.tag}
            </span>

            <h3 className="case-card-title">{caseItem.title}</h3>

            <div className="case-info">
              <p className="case-paragraph">
                <span className="case-label">Проблема:</span> {caseItem.problem}
              </p>
              <p className="case-paragraph">
                <span className="case-label">Рішення:</span> {caseItem.solution}
              </p>
            </div>

            <div className="case-metrics">
              {caseItem.metrics.map((metric) => (
                <div className="case-metric" key={metric.label}>
                  <span
                    className="case-metric-value"
                    data-numeric={String(metric.numeric)}
                    data-target={metric.numericTarget}
                    data-suffix={metric.suffix}
                  >
                    {metric.value}
                  </span>
                  <span className="case-metric-label">{metric.label}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
