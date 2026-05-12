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
        <span className="footer-copy">{t('copy')}</span>
        <span className="footer-fop">{t('fop')}</span>
        <span className="footer-address">{t('address')}</span>
        <Link href={`/${locale}/privacy-policy`} className="footer-privacy">
          {t('privacy')}
        </Link>
        <a href="https://t.me/angordien" className="footer-tg" target="_blank" rel="noopener noreferrer">
          {t('telegram')}
        </a>
      </div>
    </footer>
  )
}
