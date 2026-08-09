'use client'
import { useTranslations } from 'next-intl'
import { useScrollReveal } from '@/lib/useScrollReveal'
import './css/Pains.css'

export default function AiSecurity() {
  const t = useTranslations('ai.security')
  const items = t.raw('items') as string[]
  const ref = useScrollReveal<HTMLElement>()

  return (
    <section className="pains" id="ai-security" ref={ref}>
      <div className="pains-inner">
        <div className="pains-answer animate-in">
          <h3 className="pains-answer-title">{t('title')}</h3>
          <ul className="pains-answer-list">
            {items.map((item, i) => (
              <li key={i}>{item}</li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  )
}
