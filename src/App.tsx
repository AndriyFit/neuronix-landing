import Navbar from './components/Navbar'
import Hero from './components/Hero'
import Services from './components/Services'
import Cases from './components/Cases'
import About from './components/About'
import Testimonials from './components/Testimonials'
import Contact from './components/Contact'
import './styles/sections-video.css'

function App() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <div className="sections-video-wrapper">
          <video
            className="sections-video-bg"
            autoPlay
            loop
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
