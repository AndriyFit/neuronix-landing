import { useTranslations } from 'next-intl'
import './css/Footer.css'

export default function Footer() {
  const t = useTranslations('footer')
  return (
    <footer className="footer">
      <div className="footer-inner">
        <span className="footer-logo">NEURONIX</span>
        <span className="footer-copy">{t('copy')}</span>
        <a href="https://t.me/neuronix_ua" className="footer-tg" target="_blank" rel="noopener noreferrer">
          {t('telegram')}
        </a>
      </div>
    </footer>
  )
}