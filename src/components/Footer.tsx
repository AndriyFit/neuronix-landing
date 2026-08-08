'use client'

import { useTranslations } from 'next-intl'
import { Link } from '@/i18n/navigation'
import './css/Footer.css'

export default function Footer() {
  const t = useTranslations('footer')

  return (
    <footer className="footer">
      <div className="footer-inner">
        <span className="footer-logo">NEURONIX</span>
        <span className="footer-copy">{t('copy')}</span>
        <span className="footer-fop">{t('fop')}</span>
        <span className="footer-address">{t('address')}</span>
        <Link href="/privacy-policy" className="footer-privacy">
          {t('privacy')}
        </Link>
        <a href="https://t.me/angordien" className="footer-tg" target="_blank" rel="noopener noreferrer">
          {t('telegram')}
        </a>
      </div>
    </footer>
  )
}
