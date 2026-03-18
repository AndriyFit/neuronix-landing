'use client'
import { useEffect, useRef } from 'react'
import { useTranslations } from 'next-intl'
import './css/About.css'

interface CounterProps {
  target: number
  suffix?: string
  label: string
}

function Counter({ target, suffix = '', label }: CounterProps) {
  const ref = useRef<HTMLDivElement>(null)
  const animated = useRef(false)

  useEffect(() => {
    if (!ref.current) return
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !animated.current) {
          animated.current = true
          const el = ref.current!
          const duration = 2000
          const start = performance.now()
          const step = (now: number) => {
            const progress = Math.min((now - start) / duration, 1)
            const eased = 1 - Math.pow(1 - progress, 3)
            el.textContent = Math.round(eased * target) + suffix
            if (progress < 1) requestAnimationFrame(step)
          }
          requestAnimationFrame(step)
          observer.disconnect()
        }
      },
      { threshold: 0.3 }
    )
    observer.observe(ref.current)
    return () => observer.disconnect()
  }, [target, suffix])

  return (
    <div className="about-counter animate-in">
      <div className="about-counter-value" ref={ref}>
        0{suffix}
      </div>
      <div className="about-counter-label">{label}</div>
    </div>
  )
}

export default function About() {
  const sectionRef = useRef<HTMLElement>(null)
  const t = useTranslations('about')
  const counters = t.raw('counters') as Array<{ value: number; suffix: string; label: string }>

  useEffect(() => {
    if (!sectionRef.current) return
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible')
            observer.unobserve(entry.target)
          }
        })
      },
      { threshold: 0.1 }
    )
    sectionRef.current.querySelectorAll('.animate-in').forEach((el) => observer.observe(el))
    return () => observer.disconnect()
  }, [])

  return (
    <section id="about" className="about" ref={sectionRef}>
      <h2 className="about-title animate-in">{t('title')}</h2>
      <p className="about-description animate-in">
        {t('description')}
      </p>
      <div className="about-counters">
        {counters.map((c, i) => (
          <Counter key={i} target={c.value} suffix={c.suffix} label={c.label} />
        ))}
      </div>
    </section>
  )
}
