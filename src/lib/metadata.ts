import type { Metadata } from 'next'
import { type Locale } from '@/i18n/config'

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://neuronix.work'

export function generateLocaleMetadata(
  locale: Locale,
  messages: Record<string, any>
): Metadata {
  const meta = messages.metadata
  return {
    title: meta.title,
    description: meta.description,
    alternates: {
      canonical: `${SITE_URL}/${locale}`,
      languages: {
        uk: `${SITE_URL}/uk`,
        en: `${SITE_URL}/en`,
      },
    },
    openGraph: {
      title: meta.title,
      description: meta.description,
      url: `${SITE_URL}/${locale}`,
      siteName: 'Neuronix AI',
      locale: locale === 'uk' ? 'uk_UA' : 'en_US',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: meta.title,
      description: meta.description,
    },
  }
}
