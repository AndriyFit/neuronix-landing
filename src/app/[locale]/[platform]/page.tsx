import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getMessages, setRequestLocale } from 'next-intl/server'
import { routing } from '@/i18n/routing'
import { SITE_URL } from '@/lib/site'
import { getFAQSchema } from '@/lib/structured-data'
import AiHero from '@/components/AiHero'
import Pricing from '@/components/Pricing'
import Pains from '@/components/Pains'
import Services from '@/components/Services'
import CaseStudy from '@/components/CaseStudy'
import AiSecurity from '@/components/AiSecurity'
import AiStats from '@/components/AiStats'
import HowWeWork from '@/components/HowWeWork'
import AuditForm from '@/components/AuditForm'
import FAQ from '@/components/FAQ'
import Contact from '@/components/Contact'
import Footer from '@/components/Footer'

// Слаги статичних сторінок цього маршруту. Крім платформ тут живуть Ads-посадкові
// (websites/online-store/price) — назва константи історична. sitemap.ts імпортує
// цей самий масив, щоб слаг не доводилось дописувати у двох місцях.
export const PLATFORMS = [
  'opencart',
  'horoshop',
  'keycrm',
  'websites',
  'online-store',
  'price',
] as const
type Platform = (typeof PLATFORMS)[number]

type Props = { params: Promise<{ locale: string; platform: string }> }

export const dynamicParams = false

export function generateStaticParams() {
  return routing.locales.flatMap((locale) =>
    PLATFORMS.map((platform) => ({ locale, platform }))
  )
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, platform } = await params
  if (!PLATFORMS.includes(platform as Platform)) notFound()
  setRequestLocale(locale)
  const messages = (await getMessages()) as Record<string, any>
  const meta = messages.platforms[platform].metadata
  return {
    title: meta.title,
    description: meta.description,
    alternates: {
      canonical: `${SITE_URL}/${locale}/${platform}`,
      languages: {
        uk: `${SITE_URL}/uk/${platform}`,
        en: `${SITE_URL}/en/${platform}`,
        'x-default': `${SITE_URL}/uk/${platform}`,
      },
    },
    openGraph: {
      title: meta.title,
      description: meta.description,
      url: `${SITE_URL}/${locale}/${platform}`,
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

export default async function PlatformPage({ params }: Props) {
  const { locale, platform } = await params
  if (!PLATFORMS.includes(platform as Platform)) notFound()
  setRequestLocale(locale)
  const messages = (await getMessages()) as Record<string, any>
  const faqSchema = getFAQSchema(messages.platforms[platform].faq.items)
  const ns = `platforms.${platform}`

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <AiHero namespace={`${ns}.hero`} />
      {platform === 'price' && <Pricing />}
      <Pains namespace={`${ns}.pains`} />
      <AiStats namespace="platforms.shared.ecommStats" />
      <Services namespace={`${ns}.solutions`} />
      {platform === 'opencart' && <CaseStudy />}
      <HowWeWork namespace="platforms.shared.fullCycle" />
      <AiSecurity namespace="platforms.shared.yourPart" id="your-part" />
      <AiSecurity namespace="platforms.shared.contentEngine" />
      <AuditForm />
      <FAQ namespace={`${ns}.faq`} />
      <Contact />
      <Footer />
    </>
  )
}
