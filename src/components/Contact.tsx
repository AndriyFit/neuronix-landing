import { useEffect, useRef, useState } from 'react'
import { useForm } from 'react-hook-form'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import './Contact.css'

gsap.registerPlugin(ScrollTrigger)

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
    const ctx = gsap.context(() => {
      gsap.from('.contact-title', {
        scrollTrigger: {
          trigger: '.contact-title',
          start: 'top 90%',
          once: true,
        },
        y: 30,
        opacity: 0,
        duration: 0.6,
        ease: 'power3.out',
      })

      gsap.from('.contact-form', {
        scrollTrigger: {
          trigger: '.contact-form',
          start: 'top 85%',
          once: true,
        },
        y: 60,
        opacity: 0,
        duration: 0.7,
        ease: 'power3.out',
      })
    }, sectionRef)

    return () => ctx.revert()
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
      <h2 className="contact-title">Готові автоматизувати ваш бізнес?</h2>
      <p className="contact-subtitle">
        Залиште заявку і ми зв'яжемось з вами протягом 24 годин
      </p>

      <form className="contact-form" onSubmit={handleSubmit(onSubmit)} noValidate>
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

      <div className="contact-info">
        <a href="tel:+380632131323" className="contact-link">
          +380 63 213 13 23
        </a>
        <a
          href="https://t.me/neuronix_ai"
          className="contact-link"
          target="_blank"
          rel="noopener noreferrer"
        >
          @neuronix_ai
        </a>
      </div>

      <footer className="contact-footer">
        &copy; 2025 Neuronix AI. Всі права захищені.
      </footer>
    </section>
  )
}
