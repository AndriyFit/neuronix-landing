'use client'

import { useLocale } from 'next-intl'
import { useRouter, usePathname } from '@/i18n/navigation'
import { type Locale } from '@/i18n/config'

export default function LanguageSwitcher() {
  const locale = useLocale() as Locale
  const router = useRouter()
  const pathname = usePathname()

  const switchLocale = (newLocale: Locale) => {
    router.replace(pathname, { locale: newLocale, scroll: false })
  }

  return (
    <div className="lang-switcher">
      <button
        className={`lang-btn ${locale === 'uk' ? 'lang-btn-active' : ''}`}
        onClick={() => switchLocale('uk')}
      >
        UA
      </button>
      <span className="lang-divider">/</span>
      <button
        className={`lang-btn ${locale === 'en' ? 'lang-btn-active' : ''}`}
        onClick={() => switchLocale('en')}
      >
        EN
      </button>
    </div>
  )
}
