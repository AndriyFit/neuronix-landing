import type { Metadata } from 'next'
import { getMessages, setRequestLocale } from 'next-intl/server'
import { SITE_URL } from '@/lib/site'
import { getFAQSchema } from '@/lib/structured-data'
import AiHero from '@/components/AiHero'
import Pains from '@/components/Pains'
import Services from '@/components/Services'
import AiStats from '@/components/AiStats'
import AiSecurity from '@/components/AiSecurity'
import AuditForm from '@/components/AuditForm'
import FAQ from '@/components/FAQ'
import Contact from '@/components/Contact'
import Footer from '@/components/Footer'

type Props = { params: Promise<{ locale: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  setRequestLocale(locale)
  const messages = (await getMessages()) as Record<string, any>
  const meta = messages.ai.metadata
  return {
    title: meta.title,
    description: meta.description,
    alternates: {
      canonical: `${SITE_URL}/${locale}/ai`,
      languages: {
        uk: `${SITE_URL}/uk/ai`,
        en: `${SITE_URL}/en/ai`,
      },
    },
    openGraph: {
      title: meta.title,
      description: meta.description,
      url: `${SITE_URL}/${locale}/ai`,
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

export default async function AiPage({ params }: Props) {
  const { locale } = await params
  setRequestLocale(locale)
  const messages = (await getMessages()) as Record<string, any>
  const faqSchema = getFAQSchema(messages.ai.faq.items)

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <AiHero />
      <Pains namespace="ai.pains" />
      <Services namespace="ai.solutions" />
      <AiStats />
      <AiSecurity />
      <AuditForm />
      <FAQ namespace="ai.faq" />
      <Contact />
      <Footer />
    </>
  )
}
