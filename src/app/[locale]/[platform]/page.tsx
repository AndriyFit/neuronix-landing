import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getMessages, setRequestLocale } from 'next-intl/server'
import { routing } from '@/i18n/routing'
import { SITE_URL } from '@/lib/site'
import { getFAQSchema } from '@/lib/structured-data'
import { PLATFORMS, type Platform } from '@/lib/platforms'
import AiHero from '@/components/AiHero'
import Pricing from '@/components/Pricing'
import Pains from '@/components/Pains'
import Services from '@/components/Services'
import AiSecurity from '@/components/AiSecurity'
import AiStats from '@/components/AiStats'
import HowWeWork from '@/components/HowWeWork'
import AuditForm from '@/components/AuditForm'
import FAQ from '@/components/FAQ'
import Contact from '@/components/Contact'
import Footer from '@/components/Footer'

// Ці три — посадкові для картки «яке рішення підійде» з головної (solutionGuide).
// Візитер там ще не знає, що таке лендінг/Horoshop/OpenCart, тож сторінка — лише
// пояснення «що це» (в hero.subtitle) + форма консультації, без цін/кейсів/FAQ.
const EXPLAINER_PAGES: readonly string[] = ['websites', 'horoshop', 'opencart']

// Вибір платформи має сенс лише там, де людина справді обирає рушій магазину.
// На /price це збиває з пантелику: там питання «який тип сайту», не «яка CMS».
// opencart/horoshop сюди більше не входять — вони explainer-сторінки (див. вище).
const STORE_PAGES: readonly string[] = ['online-store', 'keycrm']

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
  const ns = `platforms.${platform}`

  if (EXPLAINER_PAGES.includes(platform)) {
    return (
      <>
        <AiHero namespace={`${ns}.hero`} ctaTarget="contact" />
        <Contact />
        <Footer />
      </>
    )
  }

  const faqSchema = getFAQSchema(messages.platforms[platform].faq.items)

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
      {STORE_PAGES.includes(platform) && (
        <Services namespace="platforms.shared.techChoice" id="tech-choice" />
      )}
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
