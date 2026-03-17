import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import './Testimonials.css'

gsap.registerPlugin(ScrollTrigger)

const TESTIMONIALS = [
  {
    name: 'Abertime — інтернет-магазин годинників',
    role: 'Власник',
    text: 'Час додавання товару скоротився з 5 хвилин до 30 секунд. 15 кроків — від фото до 1С — повністю автоматизовані. Оператори працюють у 10 разів швидше.',
  },
  {
    name: 'SportVida — спортивні товари',
    role: 'Керівник відділу продажів',
    text: 'Голосовий AI-агент обдзвонює замовлення автоматично. 90% підтверджень — без менеджера. Окупився за перший місяць роботи.',
  },
  {
    name: 'WaterDelivery — доставка води',
    role: 'Власник',
    text: 'Dashboard замінив Excel і блокнот. Замовлення з двох сайтів падають автоматично, кур\'єри призначаються одразу. Економимо 3 години на день.',
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
    const ctx = gsap.context(() => {
      gsap.from('.testimonials-title', {
        scrollTrigger: {
          trigger: '.testimonials-title',
          start: 'top 90%',
          once: true,
        },
        y: 30,
        opacity: 0,
        duration: 0.6,
        ease: 'power3.out',
      })

      gsap.from('.testimonial-card', {
        scrollTrigger: {
          trigger: '.testimonials-track',
          start: 'top 85%',
          once: true,
        },
        y: 60,
        opacity: 0,
        duration: 0.7,
        ease: 'power3.out',
        stagger: 0.15,
      })
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  return (
    <section id="testimonials" className="testimonials" ref={sectionRef}>
      <h2 className="testimonials-title">Відгуки клієнтів</h2>

      <div className="testimonials-slider">
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
