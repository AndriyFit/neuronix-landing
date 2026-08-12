'use client'
import { useEffect, useState } from 'react'
import { useTranslations } from 'next-intl'
import './css/HeroVideo.css'

/**
 * Готовий рендер хабу в Hero. Підписи вшиті у відео українською, тому на /en
 * показується SVG-версія (див. Hero.tsx) — інакше англомовний відвідувач
 * бачив би «Аналітика» й «Чеки».
 *
 * Фон ролика білий лише на першому кадрі, далі сірувата сітка, тому краї
 * розмиваються маскою — без неї на білій сторінці видно прямокутник.
 */
export default function HeroVideo() {
  const t = useTranslations('hero.hub')
  const [motionOk, setMotionOk] = useState(true)

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    setMotionOk(!mq.matches)
    const onChange = () => setMotionOk(!mq.matches)
    mq.addEventListener('change', onChange)
    return () => mq.removeEventListener('change', onChange)
  }, [])

  if (!motionOk) {
    return (
      <div className="hero-video">
        <img src="/hero/hero-poster.webp" alt={t('alt')} width={760} height={428} />
      </div>
    )
  }

  return (
    <div className="hero-video">
      <video
        autoPlay
        loop
        muted
        playsInline
        preload="metadata"
        poster="/hero/hero-poster.webp"
        aria-label={t('alt')}
      >
        <source src="/hero/hero.webm" type="video/webm" />
        <source src="/hero/hero.mp4" type="video/mp4" />
      </video>
    </div>
  )
}
