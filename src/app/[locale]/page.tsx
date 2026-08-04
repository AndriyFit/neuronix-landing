import Hero from '@/components/Hero'
import TrustBar from '@/components/TrustBar'
import Pains from '@/components/Pains'
import Ecosystem from '@/components/Ecosystem'
import CaseStudy from '@/components/CaseStudy'
import AuditForm from '@/components/AuditForm'
import Services from '@/components/Services'
import HowWeWork from '@/components/HowWeWork'
import Pricing from '@/components/Pricing'
import FAQ from '@/components/FAQ'
import Contact from '@/components/Contact'
import Footer from '@/components/Footer'

export default function HomePage() {
  return (
    <>
      <Hero />
      <TrustBar />
      <Pains />
      <Ecosystem />
      <CaseStudy />
      <AuditForm />
      <Services />
      <HowWeWork />
      <Pricing />
      <FAQ />
      <Contact />
      <Footer />
    </>
  )
}
