'use client'

import { useState, useEffect } from 'react'
import { useLocale, useTranslations } from 'next-intl'
import Link from 'next/link'
import {
  CONSENT_STORAGE_KEY,
  VISITOR_COUNTRY_COOKIE,
  shouldShowConsentBanner,
  updateConsent,
} from '@/lib/consent'
import './css/CookieConsent.css'

export default function CookieConsent() {
  const t = useTranslations('cookie')
  const locale = useLocale()
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    if (localStorage.getItem(CONSENT_STORAGE_KEY)) return
    const country = document.cookie.match(
      new RegExp(`(?:^|;\\s*)${VISITOR_COUNTRY_COOKIE}=([A-Za-z]{2})`)
    )?.[1]
    setVisible(shouldShowConsentBanner(country))
  }, [])

  function choose(granted: boolean) {
    localStorage.setItem(CONSENT_STORAGE_KEY, granted ? 'accepted' : 'declined')
    updateConsent(granted)
    setVisible(false)
  }

  if (!visible) return null

  return (
    <div className="cookie-banner" role="dialog" aria-label={t('label')}>
      <p className="cookie-text">
        {t('text')}{' '}
        <Link href={`/${locale}/privacy-policy`}>{t('more')}</Link>
      </p>
      <div className="cookie-actions">
        <button className="cookie-accept" onClick={() => choose(true)}>
          {t('accept')}
        </button>
        <button className="cookie-decline" onClick={() => choose(false)}>
          {t('decline')}
        </button>
      </div>
    </div>
  )
}
