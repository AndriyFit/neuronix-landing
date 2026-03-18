'use client'
import { useEffect, useRef, useState } from 'react'
import { useTranslations } from 'next-intl'
import './css/Testimonials.css'

export default function Testimonials() {
  const sectionRef = useRef<HTMLElement>(null)
  const [activeIndex, setActiveIndex] = useState(0)
  const t = useTranslations('testimonials')
  const items = t.raw('items') as Array<{ quote: string; author: string; role: string; initials: string }>

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % items.length)
    }, 5000)
    return () => clearInterval(interval)
  }, [items.length])

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
    <section id="testimonials" className="testimonials" ref={sectionRef}>
      <h2 className="testimonials-title animate-in">{t('title')}</h2>

      <div className="testimonials-slider animate-in">
        <div
          className="testimonials-track"
          style={{ transform: `translateX(-${activeIndex * 100}%)` }}
        >
          {items.map((item) => (
            <div className="testimonial-card" key={item.author}>
              <span className="testimonial-quote">&laquo;&raquo;</span>
              <p className="testimonial-text">{item.quote}</p>
              <div className="testimonial-author">
                <div className="testimonial-avatar">{item.initials}</div>
                <div className="testimonial-author-info">
                  <div className="testimonial-name">{item.author}</div>
                  <div className="testimonial-role">{item.role}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="testimonials-desktop">
        {items.map((item, i) => (
          <div
            className="testimonial-card animate-in"
            key={item.author}
            style={{ transitionDelay: `${i * 0.15}s` }}
          >
            <span className="testimonial-quote">&laquo;&raquo;</span>
            <p className="testimonial-text">{item.quote}</p>
            <div className="testimonial-author">
              <div className="testimonial-avatar">{item.initials}</div>
              <div className="testimonial-author-info">
                <div className="testimonial-name">{item.author}</div>
                <div className="testimonial-role">{item.role}</div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="testimonials-dots">
        {items.map((_, i) => (
          <button
            key={i}
            className={`testimonials-dot${i === activeIndex ? ' active' : ''}`}
            onClick={() => setActiveIndex(i)}
            aria-label={`Slide ${i + 1}`}
          />
        ))}
      </div>
    </section>
  )
}
