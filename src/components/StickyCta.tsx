'use client'
import { useEffect, useState } from 'react'
import { useTranslations } from 'next-intl'
import './css/StickyCta.css'

export default function StickyCta() {
  const t = useTranslations('stickyCta')
  const [scrolled, setScrolled] = useState(false)
  const [atContact, setAtContact] = useState(false)

  useEffect(() => {
    const root = document.getElementById('page-scroll')
    if (!root) return
    const onScroll = () => setScrolled(root.scrollTop > 400)
    onScroll()
    root.addEventListener('scroll', onScroll, { passive: true })

    // Hide the bar over the contact form — otherwise it covers the submit button.
    const contact = document.querySelector('#contact')
    const observer = contact
      ? new IntersectionObserver(([entry]) => setAtContact(entry.isIntersecting), {
          root,
          threshold: 0.15,
        })
      : null
    if (contact && observer) observer.observe(contact)

    return () => {
      root.removeEventListener('scroll', onScroll)
      observer?.disconnect()
    }
  }, [])

  const scrollToContact = () => {
    document.querySelector('#contact')?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <div className={`sticky-cta${scrolled && !atContact ? ' shown' : ''}`}>
      <button className="sticky-cta-form" onClick={scrollToContact}>
        {t('form')}
      </button>
      <a
        className="sticky-cta-tg"
        href={t('telegramUrl')}
        target="_blank"
        rel="noopener noreferrer"
      >
        {t('telegram')}
      </a>
    </div>
  )
}
