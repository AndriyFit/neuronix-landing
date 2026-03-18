'use client'
import { useEffect, useRef } from 'react'
import { useTranslations } from 'next-intl'
import './css/Cases.css'

export default function Cases() {
  const sectionRef = useRef<HTMLElement>(null)
  const t = useTranslations('cases')
  const items = t.raw('items') as Array<{
    tag: string
    tagColor: string
    title: string
    problem: string
    solution: string
    metrics: string[]
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

  return (
    <section id="cases" className="cases" ref={sectionRef}>
      <h2 className="cases-title animate-in">{t('title')}</h2>
      <div className="cases-grid">
        {items.map((caseItem, i) => (
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
              {caseItem.metrics.map((metric, j) => (
                <div className="case-metric" key={j}>
                  <span className="case-metric-value">{metric}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
