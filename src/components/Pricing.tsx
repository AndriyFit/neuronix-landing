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