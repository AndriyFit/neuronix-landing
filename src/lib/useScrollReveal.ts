'use client'
import { useEffect, useRef } from 'react'

/**
 * Reveals `.animate-in` children by adding `.visible` when they scroll into
 * view. Observes inside `#page-scroll` — the custom scroll container the
 * layout uses instead of the document (see the iOS toolbar fix in
 * AnimatedBackground).
 */
export function useScrollReveal<T extends HTMLElement = HTMLElement>() {
  const ref = useRef<T>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible')
            observer.unobserve(entry.target)
          }
        })
      },
      { threshold: 0.1, root: document.getElementById('page-scroll') },
    )

    el.querySelectorAll('.animate-in').forEach((node) => observer.observe(node))
    return () => observer.disconnect()
  }, [])

  return ref
}
