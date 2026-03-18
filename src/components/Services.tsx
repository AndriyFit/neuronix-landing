'use client'
import { useEffect, useRef } from 'react'
import { useTranslations } from 'next-intl'
import './css/Services.css'

export default function Services() {
  const sectionRef = useRef<HTMLElement>(null)
  const t = useTranslations('services')
  const items = t.raw('items') as Array<{ icon: string; title: string; description: string }>

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
      <h2 className="services-title animate-in">{t('title')}</h2>
      <div className="services-grid">
        {items.map((item, i) => (
          <div
            className="service-card animate-in"
            key={item.title}
            style={{ transitionDelay: `${i * 0.1}s` }}
          >
            <div className="service-icon-wrapper">
              <span className="service-icon">{item.icon}</span>
            </div>
            <h3 className="service-card-title">{item.title}</h3>
            <p className="service-card-desc">{item.description}</p>
          </div>
        ))}
      </div>
    </section>
  )
}
