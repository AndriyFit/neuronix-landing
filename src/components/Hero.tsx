'use client'
import { useTranslations } from 'next-intl'
import AnimatedTerminal from './AnimatedTerminal'
import './css/Hero.css'

export default function Hero() {
  const t = useTranslations('hero')

  const scrollToContact = () => {
    document.querySelector('#contact')?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <section className="hero" id="hero">
      <div className="hero-content">
        <span className="hero-badge hero-anim hero-anim-1">neuronix.work</span>
        <h1 className="hero-title hero-anim hero-anim-2">
          {t('titleStart')}
          <span className="hero-title-highlight">{t('titleHighlight')}</span>
          {t('titleEnd')}
        </h1>
        <p className="hero-subtitle hero-anim hero-anim-3">{t('subtitle')}</p>
        <div className="hero-actions hero-anim hero-anim-4">
          <a
            href={t('telegramUrl')}
            className="hero-cta-primary"
            target="_blank"
            rel="noopener noreferrer"
          >
            {t('ctaPrimary')}
          </a>
          <button className="hero-cta-secondary" onClick={scrollToContact}>
            {t('ctaSecondary')}
          </button>
        </div>
      </div>

      <div className="hero-visual">
        <AnimatedTerminal />
      </div>
    </section>
  )
}