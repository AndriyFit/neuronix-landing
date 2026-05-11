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