'use client'
import { useTranslations } from 'next-intl'
import { useScrollReveal } from '@/lib/useScrollReveal'
import './css/Pains.css'

export default function Pains({ namespace = 'pains' }: { namespace?: string }) {
  const t = useTranslations(namespace)
  const items = t.raw('items') as string[]
  const answers = t.raw('answers') as string[]
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

        <div className="pains-answer animate-in">
          <h3 className="pains-answer-title">{t('answerTitle')}</h3>
          <ul className="pains-answer-list">
            {answers.map((answer, i) => (
              <li key={i}>{answer}</li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  )
}
