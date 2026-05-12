'use client'

import { useState, useEffect, useCallback } from 'react'
import { useTranslations } from 'next-intl'
import LanguageSwitcher from './LanguageSwitcher'
import './css/Navbar.css'

export default function Navbar() {
  const t = useTranslations('nav')
  const NAV_ITEMS = [
    { label: t('services'), id: 'services' },
    { label: t('results'), id: 'results' },
    { label: t('pricing'), id: 'pricing' },
    { label: t('faq'), id: 'faq' },
    { label: t('contact'), id: 'contact' },
  ]

  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [mobileOpen])

  const scrollTo = useCallback((id: string) => {
    setMobileOpen(false)
    document.querySelector(`#${id}`)?.scrollIntoView({ behavior: 'smooth' })
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

        <a
          href={t('telegramUrl')}
          className="navbar-cta navbar-cta-desktop"
          target="_blank"
          rel="noopener noreferrer"
        >
          {t('cta')}
        </a>
        <LanguageSwitcher />

        <button
          className={`navbar-burger${mobileOpen ? ' open' : ''}`}
          onClick={() => setMobileOpen((v) => !v)}
          aria-label="Menu"
        >
          <span /><span /><span />
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
          <a href={t('telegramUrl')} className="navbar-cta" target="_blank" rel="noopener noreferrer">
            {t('cta')}
          </a>
        </li>
        <li><LanguageSwitcher /></li>
      </ul>
    </>
  )
}