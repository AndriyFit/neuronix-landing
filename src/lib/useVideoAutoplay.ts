'use client'
import { useEffect, useRef } from 'react'

/**
 * Стартує <video>, коли той потрапляє у в'юпорт.
 *
 * Чому не декларативний `autoplay`: у парі з `preload="none"` він не спрацьовує
 * на iOS Safari — у момент спроби браузер не має даних і просто лишає постер.
 * Явний `play()` на muted+playsInline елементі виконується і сам тягне файл.
 * А `preload="none"` прибирати не можна: інакше вага ролика лізе в критичний шлях.
 *
 * Спостерігаємо всередині `#page-scroll` — сторінка скролиться у власному
 * контейнері, а не в документі (див. useScrollReveal і фікс iOS у layout).
 */
export function useVideoAutoplay() {
  const ref = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    const video = ref.current
    if (!video) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return
        video.play().catch(() => {})
        observer.disconnect()
      },
      { threshold: 0.25, root: document.getElementById('page-scroll') },
    )
    observer.observe(video)
    return () => observer.disconnect()
  }, [])

  return ref
}
