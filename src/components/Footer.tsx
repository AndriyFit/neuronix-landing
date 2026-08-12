'use client'

import { useTranslations } from 'next-intl'
import { useLocale } from 'next-intl'
import Link from 'next/link'
import './css/Footer.css'

export default function Footer() {
  const t = useTranslations('footer')
  const locale = useLocale()

  return (
    <footer className="footer">
      <div className="footer-inner">
        <span className="footer-logo">NEURONIX</span>
        <nav className="footer-services">
          <span>{t('servicesTitle')}:</span>
          <Link href={`/${locale}/ai`}>AI</Link>
          <Link href={`/${locale}/opencart`}>OpenCart</Link>
          <Link href={`/${locale}/horoshop`}>Horoshop</Link>
          <Link href={`/${locale}/keycrm`}>KeyCRM</Link>
        </nav>
        <span className="footer-copy">{t('copy')}</span>
        <Link href={`/${locale}/privacy-policy`} className="footer-privacy">
          {t('privacy')}
        </Link>
        <a href="https://t.me/neuronixjhbot" className="footer-tg" target="_blank" rel="noopener noreferrer">
          {t('telegram')}
        </a>
      </div>
    </footer>
  )
}
