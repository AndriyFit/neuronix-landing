import type { Metadata } from 'next'
import { type Locale } from '@/i18n/config'
import { SITE_URL, localeUrl } from '@/lib/site'


export function generateLocaleMetadata(
  locale: Locale,
  messages: Record<string, any>
): Metadata {
  const meta = messages.metadata
  return {
    // Робить усі відносні URL у метаданих абсолютними від канонічного домену.
    // Без цього Next бере хост із запиту — і og:image міг би поїхати з чужим хостом.
    metadataBase: new URL(SITE_URL),
    title: meta.title,
    description: meta.description,
    alternates: {
      canonical: localeUrl(locale),
      languages: {
        uk: localeUrl('uk'),
        en: localeUrl('en'),
        // Без x-default Google складав /en і /uk в одну групу й лишав /en поза індексом
        // як «альтернативну сторінку з належним тегом канонічної». x-default каже,
        // яку версію показувати всім, чия мова не збіглася, — і розводить сторінки.
        'x-default': localeUrl('uk'),
      },
    },
    openGraph: {
      title: meta.title,
      description: meta.description,
      url: localeUrl(locale),
      siteName: 'Neuronix AI',
      locale: locale === 'uk' ? 'uk_UA' : 'en_US',
      alternateLocale: locale === 'uk' ? 'en_US' : 'uk_UA',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: meta.title,
      description: meta.description,
    },
    verification: {
      google: 'DFEtIntDI958Wl1GxZsFE4Rllrp53lu_Y8AMLW-CHUA',
    },
  }
}
