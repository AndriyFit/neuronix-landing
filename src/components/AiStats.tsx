'use client'
import { useTranslations } from 'next-intl'
import { useScrollReveal } from '@/lib/useScrollReveal'
import './css/CaseStudy.css'

export default function AiStats() {
  const t = useTranslations('ai.stats')
  const items = t.raw('items') as Array<{ metric: string; label: string }>
  const ref = useScrollReveal<HTMLElement>()

  return (
    <section className="case" id="ai-stats" ref={ref}>
      <div className="case-inner">
        <h2 className="case-title animate-in">{t('title')}</h2>
        <div className="case-metrics">
          {items.map((item, i) => (
            <div className="case-metric animate-in" key={i} style={{ transitionDelay: `${i * 0.08}s` }}>
              <div className="case-metric-value">{item.metric}</div>
              <div className="case-metric-label">{item.label}</div>
            </div>
          ))}
        </div>
        <p className="case-chain-note animate-in">{t('note')}</p>
      </div>
    </section>
  )
}
