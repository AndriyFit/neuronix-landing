import { useState, useEffect, useCallback } from 'react'
import gsap from 'gsap'
import './Navbar.css'

const NAV_ITEMS = [
  { label: 'Послуги', href: '#services' },
  { label: 'Кейси', href: '#cases' },
  { label: 'Про нас', href: '#about' },
  { label: 'Відгуки', href: '#testimonials' },
  { label: 'Контакти', href: '#contact' },
]

export default function Navbar() {
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

  const scrollTo = useCallback((href: string) => {
    setMobileOpen(false)
    const el = document.querySelector(href)
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
            <li key={item.href}>
              <a href={item.href} onClick={(e) => { e.preventDefault(); scrollTo(item.href) }}>
                {item.label}
              </a>
            </li>
          ))}
        </ul>

        <button
          className="navbar-cta navbar-cta-desktop"
          onClick={() => scrollTo('#contact')}
        >
          Консультація
        </button>

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
          <li key={item.href}>
            <a href={item.href} onClick={(e) => { e.preventDefault(); scrollTo(item.href) }}>
              {item.label}
            </a>
          </li>
        ))}
        <li>
          <button className="navbar-cta" onClick={() => scrollTo('#contact')}>
            Консультація
          </button>
        </li>
      </ul>
    </>
  )
}
