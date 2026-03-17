import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import './About.css'

gsap.registerPlugin(ScrollTrigger)

interface CounterProps {
  target: number
  suffix?: string
  label: string
}

function Counter({ target, suffix = '', label }: CounterProps) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!ref.current) return
    const obj = { val: 0 }
    gsap.to(obj, {
      val: target,
      duration: 2,
      ease: 'power1.out',
      scrollTrigger: {
        trigger: ref.current,
        start: 'top 80%',
        once: true,
      },
      onUpdate: () => {
        if (ref.current) ref.current.textContent = Math.round(obj.val) + suffix
      },
    })
  }, [target, suffix])

  return (
    <div className="about-counter">
      <div className="about-counter-value" ref={ref}>
        0
      </div>
      <div className="about-counter-label">{label}</div>
    </div>
  )
}

export default function About() {
  const sectionRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('.about-title', {
        scrollTrigger: {
          trigger: '.about-title',
          start: 'top 90%',
          once: true,
        },
        y: 30,
        opacity: 0,
        duration: 0.6,
        ease: 'power3.out',
      })

      gsap.from('.about-description', {
        scrollTrigger: {
          trigger: '.about-description',
          start: 'top 90%',
          once: true,
        },
        y: 20,
        opacity: 0,
        duration: 0.6,
        delay: 0.2,
        ease: 'power3.out',
      })
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  return (
    <section id="about" className="about" ref={sectionRef}>
      <h2 className="about-title">Про нас</h2>
      <p className="about-description">
        Neuronix — команда інженерів, яка будує AI-рішення для бізнесу від ідеї до продакшну.
        Голосові агенти, автоматизація процесів, веб-додатки, інтеграції з CRM та обліковими системами.
        Ми не робимо «красиві презентації» — ми запускаємо те, що працює і заробляє.
      </p>
      <div className="about-counters">
        <Counter target={9} suffix="+" label="реалізованих проєктів" />
        <Counter
          target={200}
          suffix="+"
          label="годин зекономлено клієнтам щомісяця"
        />
        <Counter target={8} label="технологій у стеку" />
      </div>
    </section>
  )
}
