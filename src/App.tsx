import { useRef, useEffect } from 'react'
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import Services from './components/Services'
import Cases from './components/Cases'
import About from './components/About'
import Testimonials from './components/Testimonials'
import Contact from './components/Contact'
import './styles/sections-video.css'

function App() {
  const videoRef = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    const video = videoRef.current
    if (!video) return

    let rafId: number

    const tick = () => {
      // За 0.15с до кінця — миттєво перемотуємо на початок без зупинки
      if (video.duration && video.duration - video.currentTime < 0.15) {
        video.currentTime = 0
      }
      rafId = requestAnimationFrame(tick)
    }

    rafId = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(rafId)
  }, [])

  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <div className="sections-video-wrapper">
          <video
            ref={videoRef}
            className="sections-video-bg"
            autoPlay
            muted
            playsInline
            poster="/sections-bg-poster.jpg"
          >
            <source src="/sections-bg.mp4" type="video/mp4" />
          </video>
          <div className="sections-video-overlay" />
          <div className="sections-video-fade-top" />
          <div className="sections-content">
            <Services />
            <Cases />
            <About />
            <Testimonials />
            <Contact />
          </div>
        </div>
      </main>
    </>
  )
}

export default App
