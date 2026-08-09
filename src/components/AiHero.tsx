'use client'
import { useTranslations } from 'next-intl'
import './css/Hero.css'

export default function AiHero({ namespace = 'ai.hero' }: { namespace?: string }) {
  const t = useTranslations(namespace)
  const trust = t.raw('trust') as string[]

  const scrollToAudit = () => {
    document.querySelector('#audit')?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <section className="hero" id="hero">
      <div className="hero-content">
        <h1 className="hero-title hero-anim hero-anim-1">
          {t('titleStart')}
          <span className="hero-title-highlight">{t('titleHighlight')}</span>
          {t('titleEnd')}
        </h1>
        <p className="hero-subtitle hero-anim hero-anim-2">{t('subtitle')}</p>
        <div className="hero-actions hero-anim hero-anim-3">
          <button className="hero-cta-primary" onClick={scrollToAudit}>
            {t('ctaPrimary')}
          </button>
          <a
            href={t('telegramUrl')}
            className="hero-cta-secondary"
            target="_blank"
            rel="noopener noreferrer"
          >
            {t('ctaSecondary')}
          </a>
        </div>
        <ul className="hero-trust hero-anim hero-anim-4">
          {trust.map((item, i) => (
            <li key={i}>{item}</li>
          ))}
        </ul>
      </div>
    </section>
  )
}
