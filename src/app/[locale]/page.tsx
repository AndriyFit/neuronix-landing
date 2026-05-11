import Hero from '@/components/Hero'
import Services from '@/components/Services'
import HowWeWork from '@/components/HowWeWork'
import Cases from '@/components/Cases'
import Pricing from '@/components/Pricing'
import FAQ from '@/components/FAQ'
import Contact from '@/components/Contact'
import Footer from '@/components/Footer'

export default function HomePage() {
  return (
    <>
      <Hero />
      <Services />
      <HowWeWork />
      <Cases />
      <Pricing />
      <FAQ />
      <Contact />
      <Footer />
    </>
  )
}