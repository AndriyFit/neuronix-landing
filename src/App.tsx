import { useRef, useEffect, useCallback } from 'react'
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

  const handleTimeUpdate = useCallback(() => {
    const active = videoARef.current
    const standby = videoBRef.current
    if (!active || !standby) return

    // За 0.5с до кінця — запускаємо standby і робимо crossfade
    if (active.duration - active.currentTime < 0.5 && standby.paused) {
      standby.currentTime = 0
      standby.play().catch(() => {})
      standby.style.opacity = '1'
      active.style.opacity = '0'

      // Коли active закінчиться — перезапускаємо його як standby
      setTimeout(() => {
        active.currentTime = 0
        active.pause()
      }, 600)
    }
  }, [])

  const handleTimeUpdateB = useCallback(() => {
    const active = videoBRef.current
    const standby = videoARef.current
    if (!active || !standby) return

    if (active.duration - active.currentTime < 0.5 && standby.paused) {
      standby.currentTime = 0
      standby.play().catch(() => {})
      standby.style.opacity = '1'
      active.style.opacity = '0'

      setTimeout(() => {
        active.currentTime = 0
        active.pause()
      }, 600)
    }
  }, [])

  useEffect(() => {
    const a = videoARef.current
    const b = videoBRef.current
    if (!a || !b) return

    a.addEventListener('timeupdate', handleTimeUpdate)
    b.addEventListener('timeupdate', handleTimeUpdateB)

    return () => {
      a.removeEventListener('timeupdate', handleTimeUpdate)
      b.removeEventListener('timeupdate', handleTimeUpdateB)
    }
  }, [handleTimeUpdate, handleTimeUpdateB])

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
