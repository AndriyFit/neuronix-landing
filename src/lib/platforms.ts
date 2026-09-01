// Static slugs served by the shared [platform] route. Ads landings live here too,
// so keep sitemap and generateStaticParams driven by this single source.
export const PLATFORMS = [
  'opencart',
  'horoshop',
  'keycrm',
  'websites',
  'online-store',
  'price',
] as const

export type Platform = (typeof PLATFORMS)[number]
