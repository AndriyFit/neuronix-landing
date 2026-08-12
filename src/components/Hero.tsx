'use client'
import { useLocale, useTranslations } from 'next-intl'
import SystemHub from './SystemHub'
import HeroVideo from './HeroVideo'
import './css/Hero.css'

export default function Hero() {
  const t = useTranslations('hero')
  const locale = useLocale()
  const trust = t.raw('trust') as string[]

  const scrollToContact = () => {
    document.querySelector('#contact')?.scrollIntoView({ behavior: 'smooth' })
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
          <button className="hero-cta-primary" onClick={scrollToContact}>
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

      {/* Підписи у відео вшиті українською, тож англійська локаль лишається на SVG. */}
      <div className="hero-visual">{locale === 'uk' ? <HeroVideo /> : <SystemHub />}</div>
    </section>
  )
}
