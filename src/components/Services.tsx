import { useEffect, useRef } from 'react'
import './Services.css'

const SERVICES = [
  {
    icon: '🎙️',
    title: 'Голосові AI-агенти',
    desc: 'Підтвердження замовлень, обробка дзвінків, запис результатів — Vapi + CRM інтеграція. Агент працює 24/7 без перерв і вихідних.',
  },
  {
    icon: '🤖',
    title: 'Чат-боти та асистенти',
    desc: 'Telegram, Viber, сайт — бот відповідає клієнтам миттєво. Інтеграція з вашою CRM, базою товарів та платіжними системами.',
  },
  {
    icon: '🌐',
    title: 'Веб-додатки та дашборди',
    desc: 'Адмін-панелі, CRM-дашборди, Telegram Mini Apps — React, Next.js, TypeScript. Від прототипу до продакшну за тиждень.',
  },
  {
    icon: '⚙️',
    title: 'n8n автоматизація',
    desc: 'Складні бізнес-процеси на автопілоті: обробка замовлень, синхронізація з 1С, FTP, email-розсилки — до 34 кроків в одному workflow.',
  },
  {
    icon: '✍️',
    title: 'AI-генерація контенту',
    desc: 'SEO-описи товарів, переклади UA/RU, банери акцій, картки товарів — AI генерує, людина лише перевіряє.',
  },
  {
    icon: '🗄️',
    title: 'Інтеграції та API',
    desc: 'Supabase, Cloudflare D1, MySQL, 1С, KeyCRM, SalesDrive, Binotel, Horoshop — з\'єднуємо будь-які системи між собою.',
  },
]

export default function Services() {
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
    <section id="services" className="services" ref={sectionRef}>
      <h2 className="services-title animate-in">Наші послуги</h2>
      <div className="services-grid">
        {SERVICES.map((service, i) => (
          <div
            className="service-card animate-in"
            key={service.title}
            style={{ transitionDelay: `${i * 0.1}s` }}
          >
            <div className="service-icon-wrapper">
              <span className="service-icon">{service.icon}</span>
            </div>
            <h3 className="service-card-title">{service.title}</h3>
            <p className="service-card-desc">{service.desc}</p>
          </div>
        ))}
      </div>
    </section>
  )
}
