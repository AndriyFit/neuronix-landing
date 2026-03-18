import type { MetadataRoute } from 'next'
import { locales } from '@/i18n/config'

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://neuronix.work'

export default function sitemap(): MetadataRoute.Sitemap {
  return locales.map((locale) => ({
    url: `${SITE_URL}/${locale}`,
    lastModified: new Date(),
    changeFrequency: 'weekly',
    priority: 1,
    alternates: {
      languages: Object.fromEntries(
        locales.map((l) => [l, `${SITE_URL}/${l}`])
      ),
    },
  }))
}
