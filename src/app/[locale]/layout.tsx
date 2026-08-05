import type { ReactNode } from 'react'
import type { Metadata, Viewport } from 'next'
import { Syne } from 'next/font/google'
import { NextIntlClientProvider } from 'next-intl'
import { getMessages, setRequestLocale } from 'next-intl/server'
import { notFound } from 'next/navigation'
import { GoogleTagManager } from '@next/third-parties/google'
import { routing } from '@/i18n/routing'
import { type Locale } from '@/i18n/config'
import { generateLocaleMetadata } from '@/lib/metadata'
import { CONSENT_DEFAULT_SNIPPET } from '@/lib/consent'
import {
  getOrganizationSchema,
  getWebSiteSchema,
  getServicesSchema,
  getFAQSchema,
  getLocalBusinessSchema,
} from '@/lib/structured-data'
import Navbar from '@/components/Navbar'
import AnimatedBackground from '@/components/AnimatedBackground'
import StickyCta from '@/components/StickyCta'
import Clarity from '@/components/Clarity'
import CookieConsent from '@/components/CookieConsent'
import '@/styles/variables.css'
import '@/styles/global.css'

const syne = Syne({
  subsets: ['latin', 'latin-ext'],
  weight: ['400', '500', '600', '700', '800'],
  display: 'swap',
  variable: '--font-syne',
  preload: true,
})

type Props = { params: Promise<{ locale: string }> }

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }))
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  viewportFit: 'cover',
  themeColor: '#7C3AED',
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

  const gtmId = process.env.NEXT_PUBLIC_GTM_ID

  const schemas = [
    getOrganizationSchema(),
    getLocalBusinessSchema(),
    getWebSiteSchema(),
    ...getServicesSchema(msg.services.items),
    getFAQSchema(msg.faq.items),
  ]

  return (
    <html lang={locale} className={syne.variable}>
      <head>
        {gtmId && <script dangerouslySetInnerHTML={{ __html: CONSENT_DEFAULT_SNIPPET }} />}
        <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
        {schemas.map((schema, i) => (
          <script
            key={i}
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
          />
        ))}
      </head>
      {gtmId && <GoogleTagManager gtmId={gtmId} />}
      <body>
        <NextIntlClientProvider messages={messages}>
          <AnimatedBackground />
          <Navbar />
          <div id="page-scroll" className="page-scroll">
            <main>{children}</main>
          </div>
          <StickyCta />
          <CookieConsent />
        </NextIntlClientProvider>
        <Clarity />
      </body>
    </html>
  )
}
