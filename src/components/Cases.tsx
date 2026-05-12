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
      { threshold: 0.1, root: document.getElementById('page-scroll') }
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