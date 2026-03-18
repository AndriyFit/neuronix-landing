import { useTranslations, useLocale } from 'next-intl'
import { setRequestLocale } from 'next-intl/server'
import './css/FAQ.css'

export default function FAQ() {
  const locale = useLocale()
  setRequestLocale(locale)
  const t = useTranslations('faq')
  const items = t.raw('items') as Array<{ question: string; answer: string }>

  return (
    <section className="faq" id="faq">
      <h2 className="faq-title">{t('title')}</h2>
      <div className="faq-list">
        {items.map((item, i) => (
          <details key={i} className="faq-item">
            <summary className="faq-question">{item.question}</summary>
            <p className="faq-answer">{item.answer}</p>
          </details>
        ))}
      </div>
    </section>
  )
}
