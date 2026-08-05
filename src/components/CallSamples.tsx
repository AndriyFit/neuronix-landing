'use client'
import { useTranslations } from 'next-intl'
import { useScrollReveal } from '@/lib/useScrollReveal'
import './css/CallSamples.css'

interface Sample {
  label: string
  duration: string
  src: string
}

export default function CallSamples() {
  const t = useTranslations('calls')
  const items = t.raw('items') as Sample[]
  const ref = useScrollReveal<HTMLElement>()

  return (
    <section id="calls" className="calls" ref={ref}>
      <div className="calls-inner">
        <h2 className="calls-title animate-in">{t('title')}</h2>
        <p className="calls-subtitle animate-in">{t('subtitle')}</p>

        <div className="calls-grid">
          {items.map((item, i) => (
            <figure
              className="call-card animate-in"
              key={i}
              style={{ transitionDelay: `${i * 0.08}s` }}
            >
              <figcaption className="call-head">
                <span className="call-label">{item.label}</span>
                <span className="call-duration">{item.duration}</span>
              </figcaption>
              {/* preload="none" — audio is only fetched when someone presses play,
                  so these files cost nothing on page load. */}
              <audio className="call-audio" controls preload="none" src={item.src}>
                <a href={item.src}>{item.label}</a>
              </audio>
            </figure>
          ))}
        </div>

        <p className="calls-note animate-in">{t('note')}</p>
      </div>
    </section>
  )
}
