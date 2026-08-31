'use client'
import { useEffect, useRef } from 'react'
import { useTranslations } from 'next-intl'
import './css/HowWeWork.css'

export default function HowWeWork({ namespace = 'howWeWork' }: { namespace?: string }) {
  const sectionRef = useRef<HTMLElement>(null)
  const t = useTranslations(namespace)
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
      { threshold: 0.1, root: document.getElementById('page-scroll') }
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