import { SITE_URL } from '@/lib/site'

export function getOrganizationSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'Neuronix',
    url: SITE_URL,
    logo: `${SITE_URL}/favicon.svg`,
    contactPoint: {
      '@type': 'ContactPoint',
      contactType: 'sales',
      availableLanguage: ['Ukrainian', 'English'],
      email: 'fitlife2404@gmail.com',
      url: 'https://t.me/neuronixjhbot',
    },
    sameAs: ['https://t.me/neuronixjhbot'],
  }
}

export function getLocalBusinessSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'ProfessionalService',
    '@id': `${SITE_URL}#localbusiness`,
    name: 'Neuronix — розробка сайтів та автоматизація',
    image: `${SITE_URL}/favicon.svg`,
    url: SITE_URL,
    priceRange: '$$',
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'Львів',
      addressRegion: 'Львівська область',
      addressCountry: 'UA',
    },
    areaServed: [
      { '@type': 'Country', name: 'Ukraine' },
      { '@type': 'City', name: 'Львів' },
      { '@type': 'City', name: 'Київ' },
    ],
    openingHoursSpecification: {
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
      opens: '09:00',
      closes: '19:00',
    },
    sameAs: ['https://t.me/neuronixjhbot'],
  }
}

export function getBreadcrumbSchema(items: Array<{ name: string; url: string }>) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  }
}

export function getBlogPostingSchema(opts: {
  title: string
  description: string
  slug: string
  locale: string
  publishedAt: string
  updatedAt: string
  keywords: string[]
}) {
  const url = `${SITE_URL}/${opts.locale}/blog/${opts.slug}`
  return {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    mainEntityOfPage: { '@type': 'WebPage', '@id': url },
    headline: opts.title,
    description: opts.description,
    image: `${SITE_URL}/favicon.svg`,
    keywords: opts.keywords.join(', '),
    datePublished: opts.publishedAt,
    dateModified: opts.updatedAt,
    inLanguage: opts.locale === 'uk' ? 'uk-UA' : 'en-US',
    author: {
      '@type': 'Organization',
      name: 'Neuronix',
      url: SITE_URL,
    },
    publisher: {
      '@type': 'Organization',
      name: 'Neuronix',
      logo: { '@type': 'ImageObject', url: `${SITE_URL}/favicon.svg` },
    },
  }
}

export function getWebSiteSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'Neuronix AI',
    url: SITE_URL,
    potentialAction: {
      '@type': 'SearchAction',
      target: `${SITE_URL}/?q={search_term_string}`,
      'query-input': 'required name=search_term_string',
    },
  }
}

export function getServicesSchema(services: Array<{ title: string; description: string }>) {
  return services.map((s) => ({
    '@context': 'https://schema.org',
    '@type': 'Service',
    provider: { '@type': 'Organization', name: 'Neuronix AI' },
    name: s.title,
    description: s.description,
    areaServed: 'UA',
  }))
}

export function getFAQSchema(items: Array<{ question: string; answer: string }>) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: items.map((item) => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: item.answer,
      },
    })),
  }
}
