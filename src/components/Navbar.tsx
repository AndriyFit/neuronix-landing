'use client'

import { useState, useEffect, useCallback } from 'react'
import { useTranslations } from 'next-intl'
import gsap from 'gsap'
import LanguageSwitcher from './LanguageSwitcher'
import './css/Navbar.css'

export default function Navbar() {
  const t = useTranslations('nav')
  const NAV_ITEMS = [
    { label: t('services'), id: 'services' },
    { label: t('cases'), id: 'cases' },
    { label: t('about'), id: 'about' },
    { label: t('testimonials'), id: 'testimonials' },
    { label: t('contact'), id: 'contact' },
  ]

  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // GSAP entrance
  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('.navbar', {
        y: -60,
        opacity: 0,
        duration: 0.8,
        ease: 'power3.out',
        delay: 0.2,
      })
    })
    return () => ctx.revert()
  }, [])

  // Lock body scroll when mobile menu open
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [mobileOpen])

  const scrollTo = useCallback((id: string) => {
    setMobileOpen(false)
    const el = document.querySelector(`#${id}`)
    el?.scrollIntoView({ behavior: 'smooth' })
  }, [])

  return (
    <>
      <nav className={`navbar${scrolled ? ' scrolled' : ''}`}>
        <div className="navbar-logo" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
          NEURONIX
        </div>

        <ul className="navbar-links">
          {NAV_ITEMS.map((item) => (
            <li key={item.id}>
              <a href={`#${item.id}`} onClick={(e) => { e.preventDefault(); scrollTo(item.id) }}>
                {item.label}
              </a>
            </li>
          ))}
        </ul>

        <button
          className="navbar-cta navbar-cta-desktop"
          onClick={() => scrollTo('contact')}
        >
          {t('cta')}
        </button>
        <LanguageSwitcher />

        <button
          className={`navbar-burger${mobileOpen ? ' open' : ''}`}
          onClick={() => setMobileOpen((v) => !v)}
          aria-label="Menu"
        >
          <span />
          <span />
          <span />
        </button>
      </nav>

      <ul className={`navbar-mobile${mobileOpen ? ' open' : ''}`}>
        {NAV_ITEMS.map((item) => (
          <li key={item.id}>
            <a href={`#${item.id}`} onClick={(e) => { e.preventDefault(); scrollTo(item.id) }}>
              {item.label}
            </a>
          </li>
        ))}
        <li>
          <button className="navbar-cta" onClick={() => scrollTo('contact')}>
            {t('cta')}
          </button>
        </li>
        <li>
          <LanguageSwitcher />
        </li>
      </ul>
    </>
  )
}
