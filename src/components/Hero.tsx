'use client'
import { useEffect, useRef } from 'react'
import { preload } from 'react-dom'
import { useTranslations } from 'next-intl'
import './css/Hero.css'

export default function Hero() {
  const t = useTranslations('hero')
  const trust = t.raw('trust') as string[]
  const videoRef = useRef<HTMLVideoElement>(null)

  // Постер ролика — LCP-елемент на мобільному. Браузер тягне poster низьким
  // пріоритетом і пізно, тому без цього LCP просідав із 1,9с до 2,8с.
  preload('/hero/hub-poster.webp', { as: 'image', fetchPriority: 'high' })

  // Ролик не автоплеїться: preload="none" тримає 388 КБ поза критичним шляхом,
  // а на мобільному він узагалі під згином — вантажиться, лише коли до нього доїхали.
  useEffect(() => {
    const video = videoRef.current
    if (!video) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return
        video.play().catch(() => {})
        observer.disconnect()
      },
      { threshold: 0.25, root: document.getElementById('page-scroll') },
    )
    observer.observe(video)
    return () => observer.disconnect()
  }, [])

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

      <div className="hero-visual">
        <video
          ref={videoRef}
          className="hero-hub"
          src="/hero/hub.mp4"
          poster="/hero/hub-poster.webp"
          preload="none"
          muted
          loop
          playsInline
          aria-label={t('hub.alt')}
        />
      </div>
    </section>
  )
}
