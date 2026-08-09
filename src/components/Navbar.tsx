'use client'

import { useState, useEffect, useCallback } from 'react'
import { useTranslations, useLocale } from 'next-intl'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import LanguageSwitcher from './LanguageSwitcher'
import './css/Navbar.css'

export default function Navbar() {
  const t = useTranslations('nav')
  const locale = useLocale()
  const pathname = usePathname()
  const isHome = pathname === `/${locale}` || pathname === `/${locale}/`

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
    const root = document.getElementById('page-scroll')
    if (!root) return
    const onScroll = () => setScrolled(root.scrollTop > 50)
    root.addEventListener('scroll', onScroll, { passive: true })
    return () => root.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    const root = document.getElementById('page-scroll')
    if (root) root.style.overflow = mobileOpen ? 'hidden' : ''
    return () => {
      if (root) root.style.overflow = ''
    }
  }, [mobileOpen])

  const scrollTo = useCallback(
    (id: string) => {
      setMobileOpen(false)
      if (!isHome) {
        window.location.href = `/${locale}#${id}`
        return
      }
      document.querySelector(`#${id}`)?.scrollIntoView({ behavior: 'smooth' })
    },
    [isHome, locale],
  )

  const scrollToTop = useCallback(() => {
    document.getElementById('page-scroll')?.scrollTo({ top: 0, behavior: 'smooth' })
  }, [])

  return (
    <>
      <nav className={`navbar${scrolled ? ' scrolled' : ''}`}>
        <div className="navbar-logo" onClick={scrollToTop}>
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
          <li>
            <Link href={`/${locale}/ai`} onClick={() => setMobileOpen(false)}>
              {t('ai')}
            </Link>
          </li>
          <li>
            <Link href={`/${locale}/blog`} onClick={() => setMobileOpen(false)}>
              {locale === 'uk' ? 'Блог' : 'Blog'}
            </Link>
          </li>
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
          <Link href={`/${locale}/ai`} onClick={() => setMobileOpen(false)}>
            {t('ai')}
          </Link>
        </li>
        <li>
          <Link href={`/${locale}/blog`} onClick={() => setMobileOpen(false)}>
            {locale === 'uk' ? 'Блог' : 'Blog'}
          </Link>
        </li>
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