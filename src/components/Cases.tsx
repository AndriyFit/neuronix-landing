import { useEffect, useRef } from 'react'
import './Cases.css'

interface CaseData {
  tag: string
  tagColor: string
  title: string
  problem: string
  solution: string
  metrics: { value: string; label: string }[]
}

const CASES: CaseData[] = [
  {
    tag: 'E-Commerce',
    tagColor: '#00D4FF',
    title: 'Abertime — автоматизація каталогу годинників',
    problem: 'Оператори витрачали 5+ хвилин на додавання кожного товару: ручне заповнення OpenCart, 1С, FTP, написання описів двома мовами.',
    solution: 'Next.js адмін-панель + Fastify API (15 кроків) + AI-описи UA/RU (OpenRouter) + MySQL + 1С API + FTP автозавантаження фото',
    metrics: [
      { value: '30 сек', label: 'замість 5 хв' },
      { value: '15', label: 'кроків автоматично' },
      { value: '0', label: 'помилок копіювання' },
    ],
  },
  {
    tag: 'Voice AI',
    tagColor: '#7B2FFF',
    title: 'Голосовий AI-агент для e-commerce',
    problem: 'Менеджери вручну обдзвонювали кожне замовлення для підтвердження — до 100+ дзвінків на день, пропуски у вихідні та ранковий час.',
    solution: 'Vapi голосовий агент з українською мовою + Cloudflare Workers + KeyCRM/SalesDrive API + автооновлення статусів + Telegram нотифікації',
    metrics: [
      { value: '90%', label: 'дзвінків без людей' },
      { value: '2 хв', label: 'замість 15' },
      { value: '24/7', label: 'без вихідних' },
    ],
  },
  {
    tag: 'Analytics',
    tagColor: '#FF2D78',
    title: 'AI-аналітика якості дзвінків',
    problem: 'Контроль якості дзвінків — вручну, вибірково. Менеджери не дотримувались скриптів, проблеми виявлялись із запізненням.',
    solution: 'Cloudflare Workers + Deepgram транскрипція + 3 AI-агенти (класифікатор → методолог → суддя) + React дашборд з графіками',
    metrics: [
      { value: '100%', label: 'дзвінків аналізуються' },
      { value: '3', label: 'AI-агенти в pipeline' },
      { value: '0', label: 'пропущених порушень' },
    ],
  },
  {
    tag: 'CRM',
    tagColor: '#00E5FF',
    title: 'WaterDelivery — CRM для доставки води',
    problem: 'Замовлення з двох сайтів записувались в Excel і блокнот. Кур\'єри призначались вручну, баланс бутлів рахувався на папері.',
    solution: 'Next.js дашборд + Supabase + Horoshop webhook інтеграція (2 сайти) + авто-призначення кур\'єрів + баланси клієнтів',
    metrics: [
      { value: '3 год', label: 'економії щодня' },
      { value: '2', label: 'сайти в одному вікні' },
      { value: '0', label: 'втрачених замовлень' },
    ],
  },
  {
    tag: 'AI Content',
    tagColor: '#FF6B35',
    title: 'Banner Automation — генерація акційних банерів',
    problem: 'Дизайнер витрачав 30+ хвилин на кожен банер: вирізав фото годинників, верстав ціни, знижки, терміни акцій вручну.',
    solution: 'Python + Pillow (auto-trim, компоновка) + FastAPI + n8n оркестрація + Telegram Bot для доставки готових банерів',
    metrics: [
      { value: '10 сек', label: 'замість 30 хв' },
      { value: '0', label: 'роботи дизайнера' },
      { value: '100%', label: 'авто-генерація' },
    ],
  },
  {
    tag: 'Mini App',
    tagColor: '#9B59B6',
    title: 'WOD Champ — CrossFit трекер',
    problem: 'Тренери записували результати WOD у блокноти та Google Sheets. Атлети не бачили свого прогресу та особистих рекордів.',
    solution: 'Telegram Mini App (React + TypeScript) + Supabase + спільноти тренерів + PR трекінг + серії тренувань + calendar heatmap',
    metrics: [
      { value: '6', label: 'спільнот тренерів' },
      { value: '100%', label: 'історія результатів' },
      { value: '0', label: 'втрачених даних' },
    ],
  },
]

export default function Cases() {
  const sectionRef = useRef<HTMLElement>(null)

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
    <section id="cases" className="cases" ref={sectionRef}>
      <h2 className="cases-title animate-in">Наші кейси</h2>
      <div className="cases-grid">
        {CASES.map((caseItem, i) => (
          <div
            className="case-card animate-in"
            key={caseItem.title}
            style={{ transitionDelay: `${i * 0.1}s` }}
          >
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
                  <span className="case-metric-value">{metric.value}</span>
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
