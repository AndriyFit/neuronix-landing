'use client'
import { useTranslations } from 'next-intl'
import { useScrollReveal } from '@/lib/useScrollReveal'
import './css/Pains.css'

export default function Pains() {
  const t = useTranslations('pains')
  const items = t.raw('items') as string[]
  const ref = useScrollReveal<HTMLElement>()

  return (
    <section id="pains" className="pains" ref={ref}>
      <div className="pains-inner">
        <h2 className="pains-title animate-in">{t('title')}</h2>
        <p className="pains-subtitle animate-in">{t('subtitle')}</p>
        <ul className="pains-grid">
          {items.map((item, i) => (
            <li
              className="pain-card animate-in"
              key={i}
              style={{ transitionDelay: `${i * 0.06}s` }}
            >
              {item}
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
