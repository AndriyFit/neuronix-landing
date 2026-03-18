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
  const videoARef = useRef<HTMLVideoElement>(null)
  const videoBRef = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    const a = videoARef.current
    const b = videoBRef.current
    if (!a || !b) return

    let activeVideo = a
    let standbyVideo = b
    let swapping = false
    let rafId: number

    const CROSSFADE_AT = 0.4 // секунд до кінця

    // Preload standby
    b.load()

    const tick = () => {
      if (
        !swapping &&
        activeVideo.duration &&
        activeVideo.duration - activeVideo.currentTime <= CROSSFADE_AT
      ) {
        swapping = true
        standbyVideo.currentTime = 0
        standbyVideo.play().catch(() => {})
        standbyVideo.style.opacity = '1'
        activeVideo.style.opacity = '0'

        // Після crossfade — swap ролі
        const prev = activeVideo
        activeVideo = standbyVideo
        standbyVideo = prev

        setTimeout(() => {
          prev.pause()
          prev.currentTime = 0
          prev.load() // preload для наступного циклу
          swapping = false
        }, 500)
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
            ref={videoARef}
            className="sections-video-bg sections-video-a"
            autoPlay
            muted
            playsInline
            poster="/sections-bg-poster.jpg"
          >
            <source src="/sections-bg.mp4" type="video/mp4" />
          </video>
          <video
            ref={videoBRef}
            className="sections-video-bg sections-video-b"
            muted
            playsInline
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
