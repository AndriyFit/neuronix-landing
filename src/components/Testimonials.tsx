'use client'
import { useTranslations } from 'next-intl'
import { useScrollReveal } from '@/lib/useScrollReveal'
import './css/Testimonials.css'

interface Item {
  quote: string
  /** Імʼя змінене на прохання клієнта — про це прямо сказано в підзаголовку секції. */
  name: string
  /** Ніша замість назви компанії: клієнти погодились на публікацію без ідентифікації. */
  role: string
}

export default function Testimonials() {
  const t = useTranslations('testimonials')
  const items = t.raw('items') as Item[]
  const ref = useScrollReveal<HTMLElement>()

  return (
    <section id="testimonials" className="testimonials" ref={ref}>
      <div className="testimonials-inner">
        <p className="testimonials-eyebrow animate-in">{t('eyebrow')}</p>
        <h2 className="testimonials-title animate-in">{t('title')}</h2>
        {/* Підзаголовок несе обовʼязкове розкриття: відгуки справжні, імена змінені.
            Без цього рядка вигадане імʼя біля справжнього відгуку читається як підробка. */}
        <p className="testimonials-subtitle animate-in">{t('subtitle')}</p>

        <ul className="testimonials-list animate-in">
          {items.map((item, i) => (
            <li className="testimonial" key={i}>
              <blockquote className="testimonial-quote">{item.quote}</blockquote>
              <p className="testimonial-author">
                <span className="testimonial-name">{item.name}</span>
                <span className="testimonial-role">{item.role}</span>
              </p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
