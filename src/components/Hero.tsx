'use client'
import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { useTranslations } from 'next-intl'
import './css/Hero.css'

export default function Hero() {
  const titleRef = useRef<HTMLHeadingElement>(null)
  const subtitleRef = useRef<HTMLParagraphElement>(null)
  const ctaRef = useRef<HTMLButtonElement>(null)

  const t = useTranslations('hero')

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } })

      tl.from(titleRef.current, {
        y: 60, opacity: 0, duration: 1, delay: 0.4,
      })
      .from(subtitleRef.current, {
        y: 40, opacity: 0, duration: 0.8,
      }, '-=0.4')
      .from(ctaRef.current, {
        y: 30, opacity: 0, duration: 0.7,
        onComplete: () => { ctaRef.current?.classList.add('hero-cta-glow') },
      }, '-=0.3')
    })

    return () => ctx.revert()
  }, [])

  const scrollToContact = () => {
    document.querySelector('#contact')?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <section className="hero" id="hero">
      <video
        className="hero-video-bg"
        autoPlay
        loop
        muted
        playsInline
        poster="/hero-bg-poster.jpg"
      >
        <source src="/hero-bg.mp4" type="video/mp4" />
      </video>
      <div className="hero-video-overlay" />

      <div className="hero-content">
        <h1 ref={titleRef} className="hero-title">
          {t('titleStart')}<span className="hero-title-gradient">{t('titleHighlight')}</span>{t('titleEnd')}
        </h1>
        <p ref={subtitleRef} className="hero-subtitle">
          {t('subtitle')}
        </p>
        <button ref={ctaRef} className="hero-cta" onClick={scrollToContact}>
          {t('cta')}
        </button>
      </div>

      <div className="hero-scroll-indicator">
        <span>{t('scroll')}</span>
        <div className="hero-scroll-arrow" />
      </div>
    </section>
  )
}
