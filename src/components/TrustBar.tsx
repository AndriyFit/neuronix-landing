'use client'
import { useTranslations } from 'next-intl'
import { useScrollReveal } from '@/lib/useScrollReveal'
import './css/TrustBar.css'

export default function TrustBar() {
  const t = useTranslations('trustBar')
  const items = t.raw('items') as Array<{ metric: string; label: string }>
  const ref = useScrollReveal<HTMLElement>()

  return (
    <section className="trustbar" ref={ref}>
      <div className="trustbar-inner">
        {items.map((item, i) => (
          <div
            className="trustbar-item animate-in"
            key={i}
            style={{ transitionDelay: `${i * 0.08}s` }}
          >
            <span className="trustbar-metric">{item.metric}</span>
            <span className="trustbar-label">{item.label}</span>
          </div>
        ))}
      </div>
    </section>
  )
}
