'use client'

import { useTranslations } from 'next-intl'
import { useLocale } from 'next-intl'
import Link from 'next/link'
import { sendGTMEvent } from '@next/third-parties/google'
import { track } from '@/lib/analytics'
import './css/Footer.css'

export default function Footer() {
  const t = useTranslations('footer')
  const locale = useLocale()

  return (
    <footer className="footer">
      <div className="footer-inner">
        <span className="footer-logo">NEURONIX</span>
        <nav className="footer-services">
          {/* Порядок = що ми продаємо. До 06.09 перелік починався з AI і назв платформ,
              тобто з нашої кухні, а не з того, по що людина прийшла. Розробка сайтів
              і магазинів — попереду, платформи лишаються як хвіст для тих, хто їх шукає. */}
          <span>{t('servicesTitle')}:</span>
          <Link href={`/${locale}/websites`}>{t('sites')}</Link>
          <Link href={`/${locale}/online-store`}>{t('store')}</Link>
          <Link href={`/${locale}/price`}>{t('prices')}</Link>
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
        <a href="mailto:hello@neuronics.work" className="footer-email">
          {t('email')}
        </a>
        <a
          href="tel:+380685026199"
          className="footer-phone"
          onClick={() => {
            sendGTMEvent({ event: 'phone_click' })
            track('phone_click')
          }}
        >
          {t('phone')}
        </a>
      </div>
    </footer>
  )
}
