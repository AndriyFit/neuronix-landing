'use client'

import { useRef, useEffect, type ReactNode } from 'react'

export default function VideoBackground({ children }: { children: ReactNode }) {
  const videoRef = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    const video = videoRef.current
    if (!video) return

    let rafId: number
    const tick = () => {
      if (video.duration && video.duration - video.currentTime < 0.15) {
        video.currentTime = 0
      }
      rafId = requestAnimationFrame(tick)
    }
    rafId = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(rafId)
  }, [])

  return (
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
      <div className="sections-content">{children}</div>
    </div>
  )
}
