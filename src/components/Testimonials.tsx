import { useEffect, useRef, useState } from 'react'
import './Testimonials.css'

const TESTIMONIALS = [
  {
    name: 'Abertime',
    role: 'Віктор, власник інтернет-магазину годинників',
    text: 'Час додавання товару скоротився з 5 хвилин до 30 секунд. 15 кроків — від фото до 1С — повністю автоматизовані. AI генерує описи двома мовами, оператори працюють у 10 разів швидше.',
  },
  {
    name: 'SportVida',
    role: 'Керівник відділу продажів, спортивні товари',
    text: 'Голосовий AI-агент обдзвонює замовлення автоматично українською. 90% підтверджень — без менеджера. Працює 24/7, оновлює статуси в CRM і надсилає звіти в Telegram.',
  },
  {
    name: 'WaterDelivery',
    role: 'Макс, власник служби доставки води',
    text: 'Dashboard замінив Excel і блокнот. Замовлення з двох сайтів падають автоматично, кур\'єри призначаються одразу. Економимо 3 години на день і жодне замовлення не губиться.',
  },
]

export default function Testimonials() {
  const sectionRef = useRef<HTMLElement>(null)
  const [activeIndex, setActiveIndex] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % TESTIMONIALS.length)
    }, 5000)
    return () => clearInterval(interval)
  }, [])

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
      <h2 className="testimonials-title animate-in">Відгуки клієнтів</h2>

      <div className="testimonials-slider animate-in">
        <div
          className="testimonials-track"
          style={{ transform: `translateX(-${activeIndex * 100}%)` }}
        >
          {TESTIMONIALS.map((item) => (
            <div className="testimonial-card" key={item.name}>
              <span className="testimonial-quote">&laquo;&raquo;</span>
              <p className="testimonial-text">{item.text}</p>
              <div className="testimonial-author">
                <div className="testimonial-avatar">{item.name.charAt(0)}</div>
                <div className="testimonial-author-info">
                  <div className="testimonial-name">{item.name}</div>
                  <div className="testimonial-role">{item.role}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="testimonials-desktop">
        {TESTIMONIALS.map((item, i) => (
          <div
            className="testimonial-card animate-in"
            key={item.name}
            style={{ transitionDelay: `${i * 0.15}s` }}
          >
            <span className="testimonial-quote">&laquo;&raquo;</span>
            <p className="testimonial-text">{item.text}</p>
            <div className="testimonial-author">
              <div className="testimonial-avatar">{item.name.charAt(0)}</div>
              <div className="testimonial-author-info">
                <div className="testimonial-name">{item.name}</div>
                <div className="testimonial-role">{item.role}</div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="testimonials-dots">
        {TESTIMONIALS.map((_, i) => (
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
