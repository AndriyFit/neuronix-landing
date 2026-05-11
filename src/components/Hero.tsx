'use client'
import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { useTranslations } from 'next-intl'
import AnimatedTerminal from './AnimatedTerminal'
import './css/Hero.css'

export default function Hero() {
  const contentRef = useRef<HTMLDivElement>(null)
  const t = useTranslations('hero')

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('.hero-badge, .hero-title, .hero-subtitle, .hero-actions', {
        y: 30,
        opacity: 0,
        duration: 0.7,
        stagger: 0.12,
        ease: 'power3.out',
        delay: 0.2,
      })
    }, contentRef)
    return () => ctx.revert()
  }, [])

  const scrollToContact = () => {
    document.querySelector('#contact')?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <section className="hero" id="hero">
      <div className="hero-content" ref={contentRef}>
        <span className="hero-badge">neuronix.work</span>
        <h1 className="hero-title">
          {t('titleStart')}
          <span className="hero-title-highlight">{t('titleHighlight')}</span>
          {t('titleEnd')}
        </h1>
        <p className="hero-subtitle">{t('subtitle')}</p>
        <div className="hero-actions">
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