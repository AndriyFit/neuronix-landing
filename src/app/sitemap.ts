import type { MetadataRoute } from 'next'
import { locales, defaultLocale } from '@/i18n/config'
import { getAllPosts } from '@/content/blog'
import { SITE_URL } from '@/lib/site'
import { PLATFORMS } from '@/lib/platforms'


export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date()
  const entries: MetadataRoute.Sitemap = []

  const altLangs = (path: string) => ({
    ...Object.fromEntries(locales.map((l) => [l, `${SITE_URL}/${l}${path}`])),
    'x-default': `${SITE_URL}/${defaultLocale}${path}`,
  })

  for (const locale of locales) {
    entries.push({
      url: `${SITE_URL}/${locale}`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 1,
      alternates: { languages: altLangs('') },
    })
  }

  for (const locale of locales) {
    entries.push({
      url: `${SITE_URL}/${locale}/ai`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.9,
      alternates: { languages: altLangs('/ai') },
    })
  }

  for (const platform of PLATFORMS) {
    for (const locale of locales) {
      entries.push({
        url: `${SITE_URL}/${locale}/${platform}`,
        lastModified: now,
        changeFrequency: 'weekly',
        priority: 0.9,
        alternates: { languages: altLangs(`/${platform}`) },
      })
    }
  }

  // privacy-policy свідомо відсутня: сторінка robots:{index:false}, а noindex у sitemap
  // Google рапортує як помилку «Submitted URL marked noindex».

  // Блог існує в обох мовах: статті дзеркальні за slug, тому alternates валідні.
  for (const locale of locales) {
    entries.push({
      url: `${SITE_URL}/${locale}/blog`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.8,
      alternates: { languages: altLangs('/blog') },
    })

    for (const post of getAllPosts(locale)) {
      entries.push({
        url: `${SITE_URL}/${locale}/blog/${post.slug}`,
        lastModified: new Date(post.updatedAt),
        changeFrequency: 'monthly',
        priority: 0.7,
        alternates: { languages: altLangs(`/blog/${post.slug}`) },
      })
    }
  }

  return entries
}
