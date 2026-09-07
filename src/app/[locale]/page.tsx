import { getMessages, setRequestLocale } from 'next-intl/server'
import { getFAQSchema } from '@/lib/structured-data'
import Hero from '@/components/Hero'
import TrustBar from '@/components/TrustBar'
import Pains from '@/components/Pains'
import Clients from '@/components/Clients'
import Testimonials from '@/components/Testimonials'
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
      {/* Формати — це і є «Послуги» з погляду відвідувача, тому саме цей блок несе
          id="services", на який цілить навбар. Другий блок нижче — для тих, у кого
          сайт уже є, і має власний id, інакше на сторінці був би дубль DOM-id. */}
      <Services namespace="solutionGuide" id="services" />
      <HowWeWork />
      <Clients />
      <Testimonials />
      <Team />
      <Pricing />
      {/* Після прайсу, а не між формами: до 06.09 головна двічі показувала сітку
          послуг (формати, потім знову сайти + Horoshop + AI), і другий блок повертав
          людину до вибору, який вона щойно зробила. Тепер це не повтор, а наступний
          крок для іншої аудиторії — у кого сайт уже працює. */}
      <Services id="automation" />
      <FAQ />
      <Contact />
      <Footer />
    </>
  )
}
