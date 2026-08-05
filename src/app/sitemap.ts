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

    entries.push({
      url: `${SITE_URL}/${locale}/privacy-policy`,
      lastModified: now,
      changeFrequency: 'yearly',
      priority: 0.3,
      alternates: { languages: altLangs('/privacy-policy') },
    })

    entries.push({
      url: `${SITE_URL}/${locale}/blog`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.8,
      alternates: { languages: altLangs('/blog') },
    })
  }

  const posts = getAllPosts()
  for (const post of posts) {
    for (const locale of locales) {
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
