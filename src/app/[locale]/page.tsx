import { getMessages, setRequestLocale } from 'next-intl/server'
import { getFAQSchema } from '@/lib/structured-data'
import Hero from '@/components/Hero'
import TrustBar from '@/components/TrustBar'
import Pains from '@/components/Pains'
import Ecosystem from '@/components/Ecosystem'
import CaseStudy from '@/components/CaseStudy'
import AuditForm from '@/components/AuditForm'
import Services from '@/components/Services'
import HowWeWork from '@/components/HowWeWork'
import Team from '@/components/Team'
import Pricing from '@/components/Pricing'
import FAQ from '@/components/FAQ'
import Contact from '@/components/Contact'
import Footer from '@/components/Footer'

type Props = { params: Promise<{ locale: string }> }

export default async function HomePage({ params }: Props) {
  const { locale } = await params
  setRequestLocale(locale)
  const messages = (await getMessages()) as Record<string, any>
  const faqSchema = getFAQSchema(messages.faq.items)

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <Hero />
      <TrustBar />
      <Pains />
      <Ecosystem />
      <CaseStudy />
      <AuditForm />
      <Services />
      <HowWeWork />
      <Team />
      <Pricing />
      <FAQ />
      <Contact />
      <Footer />
    </>
  )
}
