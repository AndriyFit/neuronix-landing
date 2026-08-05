import type { MetadataRoute } from 'next'
import { locales } from '@/i18n/config'
import { getAllPosts } from '@/content/blog'
import { SITE_URL } from '@/lib/site'


export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date()
  const entries: MetadataRoute.Sitemap = []

  const altLangs = (path: string) =>
    Object.fromEntries(locales.map((l) => [l, `${SITE_URL}/${l}${path}`]))

  for (const locale of locales) {
    entries.push({
      url: `${SITE_URL}/${locale}`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 1,
      alternates: { languages: altLangs('') },
    })
  }

  // privacy-policy свідомо відсутня: сторінка robots:{index:false}, а noindex у sitemap
  // Google рапортує як помилку «Submitted URL marked noindex».

  // Блог — лише українською. Англійських версій статей не існує, /en/blog/* редіректить
  // на /uk (див. next.config.ts), тож у sitemap їм робити нічого.
  entries.push({
    url: `${SITE_URL}/uk/blog`,
    lastModified: now,
    changeFrequency: 'weekly',
    priority: 0.8,
  })

  for (const post of getAllPosts()) {
    entries.push({
      url: `${SITE_URL}/uk/blog/${post.slug}`,
      lastModified: new Date(post.updatedAt),
      changeFrequency: 'monthly',
      priority: 0.7,
    })
  }

  return entries
}
