import { useTranslations } from 'next-intl'
import { setRequestLocale } from 'next-intl/server'
import { useLocale } from 'next-intl'
import './css/Footer.css'

export default function Footer() {
  const locale = useLocale()
  setRequestLocale(locale)
  const t = useTranslations('footer')
  return (
    <footer className="footer">
      <div className="footer-separator" />
      <p className="footer-copyright">{t('copyright')}</p>
    </footer>
  )
}
