'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import styles from './CookieConsent.module.css'

const STORAGE_KEY = 'cookie_consent'

export default function CookieConsent() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (!stored) {
      setVisible(true)
    }
  }, [])

  function handleAccept() {
    localStorage.setItem(STORAGE_KEY, 'accepted')
    setVisible(false)
  }

  function handleDecline() {
    localStorage.setItem(STORAGE_KEY, 'declined')
    setVisible(false)
  }

  if (!visible) return null

  return (
    <div className={styles.banner} role="dialog" aria-label="Cookie consent">
      <p className={styles.text}>
        Ми використовуємо cookie для коректної роботи сайту.{' '}
        <Link href="/uk/privacy-policy">Детальніше</Link>
      </p>
      <div className={styles.actions}>
        <button className={styles.accept} onClick={handleAccept}>
          Прийняти
        </button>
        <button className={styles.decline} onClick={handleDecline}>
          Відхилити
        </button>
      </div>
    </div>
  )
}
