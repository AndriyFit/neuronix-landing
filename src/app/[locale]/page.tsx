import Hero from '@/components/Hero'
import Services from '@/components/Services'
import Cases from '@/components/Cases'
import About from '@/components/About'
import FAQ from '@/components/FAQ'
import Testimonials from '@/components/Testimonials'
import Contact from '@/components/Contact'
import VideoBackground from '@/components/VideoBackground'

export default function HomePage() {
  return (
    <>
      <Hero />
      <VideoBackground>
        <Services />
        <Cases />
        <About />
        <Testimonials />
        <FAQ />
        <Contact />
      </VideoBackground>
    </>
  )
}
