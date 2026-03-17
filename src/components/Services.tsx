import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import './Services.css'

gsap.registerPlugin(ScrollTrigger)

const SERVICES = [
  {
    icon: '🎙️',
    title: 'Голосові агенти',
    desc: 'Агент телефонує, підтверджує, записує — без менеджера',
  },
  {
    icon: '🤖',
    title: 'Чат-боти',
    desc: 'Відповідає клієнтам 24/7 у Telegram, Viber, сайті',
  },
  {
    icon: '🌐',
    title: 'Сайти та лендінги',
    desc: 'Від прототипу до деплою за 5 днів',
  },
  {
    icon: '⚙️',
    title: 'n8n автоматизація',
    desc: 'Ваші процеси працюють самі, поки ви спите',
  },
  {
    icon: '✍️',
    title: 'AI контент',
    desc: 'Описи товарів, пости, email — генерується автоматично',
  },
  {
    icon: '🗄️',
    title: 'Бази даних',
    desc: 'Структуровані дані, інтеграції, API',
  },
]

export default function Services() {
  const sectionRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('.service-card', {
        scrollTrigger: {
          trigger: '.services-grid',
          start: 'top 85%',
          once: true,
        },
        y: 60,
        opacity: 0,
        duration: 0.7,
        ease: 'power3.out',
        stagger: 0.1,
      })

      gsap.from('.services-title', {
        scrollTrigger: {
          trigger: '.services-title',
          start: 'top 90%',
          once: true,
        },
        y: 30,
        opacity: 0,
        duration: 0.6,
        ease: 'power3.out',
      })
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  return (
    <section id="services" className="services" ref={sectionRef}>
      <h2 className="services-title">Наші послуги</h2>
      <div className="services-grid">
        {SERVICES.map((service) => (
          <div className="service-card" key={service.title}>
            <span className="service-icon">{service.icon}</span>
            <h3 className="service-card-title">{service.title}</h3>
            <p className="service-card-desc">{service.desc}</p>
          </div>
        ))}
      </div>
    </section>
  )
}
