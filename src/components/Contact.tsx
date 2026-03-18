import { useEffect, useRef, useState } from 'react'
import { useForm } from 'react-hook-form'
import './Contact.css'

interface FormData {
  name: string
  phone: string
  message: string
}

export default function Contact() {
  const sectionRef = useRef<HTMLElement>(null)
  const [submitted, setSubmitted] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormData>()

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

  const onSubmit = async (data: FormData) => {
    setSubmitError(null)
    try {
      const res = await fetch(
        'https://primary-7jgw-n8n.up.railway.app/webhook/neuronix_lead',
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: data.name,
            phone: data.phone,
            message: data.message,
            source: 'landing_v2',
          }),
        }
      )
      if (!res.ok) throw new Error('Server error')
      setSubmitted(true)
      reset()
      setTimeout(() => setSubmitted(false), 5000)
    } catch {
      setSubmitError('Помилка відправки. Спробуйте ще раз або зателефонуйте нам.')
    }
  }

  return (
    <section id="contact" className="contact" ref={sectionRef}>
      <h2 className="contact-title animate-in">Готові автоматизувати ваш бізнес?</h2>
      <p className="contact-subtitle animate-in">
        Залиште заявку і ми зв'яжемось з вами протягом 24 годин
      </p>

      <form className="contact-form animate-in" onSubmit={handleSubmit(onSubmit)} noValidate>
        <div className="contact-field">
          <input
            type="text"
            className={`contact-input${errors.name ? ' error' : ''}`}
            placeholder="Ваше ім'я"
            {...register('name', { required: "Ім'я обов'язкове" })}
          />
          {errors.name && (
            <span className="contact-error">{errors.name.message}</span>
          )}
        </div>

        <div className="contact-field">
          <input
            type="tel"
            className={`contact-input${errors.phone ? ' error' : ''}`}
            placeholder="+380..."
            {...register('phone', {
              required: "Телефон обов'язковий",
              pattern: {
                value: /^\+?[\d\s\-()]{7,18}$/,
                message: 'Невірний формат телефону',
              },
            })}
          />
          {errors.phone && (
            <span className="contact-error">{errors.phone.message}</span>
          )}
        </div>

        <div className="contact-field">
          <textarea
            className="contact-input contact-textarea"
            placeholder="Опишіть вашу задачу"
            rows={4}
            {...register('message')}
          />
        </div>

        <button type="submit" className="contact-submit" disabled={isSubmitting}>
          {isSubmitting ? 'Відправляємо...' : 'Надіслати заявку'}
        </button>

        {submitted && (
          <div className="contact-success">
            Дякуємо! Ми зв'яжемось з вами найближчим часом.
          </div>
        )}

        {submitError && <div className="contact-error-msg">{submitError}</div>}
      </form>

      <div className="contact-info animate-in">
        <a href="tel:+380632131323" className="contact-link">
          +380 63 213 13 23
        </a>
        <a
          href="https://t.me/FitLifeMeneger"
          className="contact-link contact-link-tg"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Telegram"
        >
          <svg className="contact-tg-icon" viewBox="0 0 24 24" fill="currentColor">
            <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/>
          </svg>
        </a>
      </div>

      <footer className="contact-footer">
        &copy; 2025 Neuronix AI. Всі права захищені.
      </footer>
    </section>
  )
}
