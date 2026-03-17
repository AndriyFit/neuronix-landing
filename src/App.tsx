import { useEffect } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import Services from './components/Services'
import Cases from './components/Cases'
import About from './components/About'
import Testimonials from './components/Testimonials'
import Contact from './components/Contact'

gsap.registerPlugin(ScrollTrigger)

function App() {
  useEffect(() => {
    // Refresh ScrollTrigger after all content loads
    ScrollTrigger.refresh()
  }, [])

  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <Services />
        <Cases />
        <About />
        <Testimonials />
        <Contact />
      </main>
    </>
  )
}

export default App
