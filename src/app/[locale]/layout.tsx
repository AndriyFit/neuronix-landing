import type { ReactNode } from 'react'
import type { Metadata } from 'next'
import { NextIntlClientProvider } from 'next-intl'
import { getMessages, setRequestLocale } from 'next-intl/server'
import { notFound } from 'next/navigation'
import { routing } from '@/i18n/routing'
import { type Locale } from '@/i18n/config'
import { generateLocaleMetadata } from '@/lib/metadata'
import {
  getOrganizationSchema,
  getWebSiteSchema,
  getServicesSchema,
  getFAQSchema,
} from '@/lib/structured-data'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import '@/styles/variables.css'
import '@/styles/global.css'
import '@/styles/sections-video.css'

type Props = { params: Promise<{ locale: string }> }

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  setRequestLocale(locale)
  const messages = await getMessages()
  return generateLocaleMetadata(locale as Locale, messages as Record<string, any>)
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: ReactNode
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params

  if (!routing.locales.includes(locale as any)) {
    notFound()
  }

  // Required for static rendering in next-intl v4
  setRequestLocale(locale)

  const messages = await getMessages()
  const msg = messages as Record<string, any>

  const schemas = [
    getOrganizationSchema(),
    getWebSiteSchema(),
    ...getServicesSchema(msg.services.items),
    getFAQSchema(msg.faq.items),
  ]

  return (
    <html lang={locale}>
      <head>
        <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Orbitron:wght@400;500;600;700;800;900&family=Syne:wght@400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
        {schemas.map((schema, i) => (
          <script
            key={i}
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
          />
        ))}
      </head>
      <body>
        <NextIntlClientProvider messages={messages}>
          <Navbar />
          <main>{children}</main>
          <Footer />
        </NextIntlClientProvider>
      </body>
    </html>
  )
}
