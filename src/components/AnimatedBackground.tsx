'use client'

import { useEffect, useRef } from 'react'
import styles from './AnimatedBackground.module.css'

interface Particle {
  x: number
  y: number
  vx: number
  vy: number
  radius: number
}

const SPEED = 0.28
const RGB = '124, 58, 237' // #7C3AED

export default function AnimatedBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d', { alpha: true })
    if (!ctx) return

    // Respect prefers-reduced-motion
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    let animId: number
    let particles: Particle[] = []
    let width = 0
    let height = 0
    let resizeTimer: number | null = null

    const isMobile = () => window.innerWidth < 768
    const getCount = () => (isMobile() ? 32 : 75)
    const getConnectDist = () => (isMobile() ? 100 : 130)

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, isMobile() ? 1.5 : 2)
      width = window.innerWidth
      height = window.innerHeight
      canvas.width = width * dpr
      canvas.height = height * dpr
      canvas.style.width = `${width}px`
      canvas.style.height = `${height}px`
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)

      const count = getCount()
      particles = Array.from({ length: count }, () => ({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * SPEED,
        vy: (Math.random() - 0.5) * SPEED,
        radius: Math.random() * 1.5 + 0.8,
      }))
    }

    const onResize = () => {
      if (resizeTimer !== null) window.clearTimeout(resizeTimer)
      resizeTimer = window.setTimeout(resize, 150)
    }

    const draw = () => {
      ctx.clearRect(0, 0, width, height)
      const connectDist = getConnectDist()

      for (let i = 0; i < particles.length; i++) {
        const a = particles[i]

        for (let j = i + 1; j < particles.length; j++) {
          const b = particles[j]
          const dx = a.x - b.x
          const dy = a.y - b.y
          const dist = Math.sqrt(dx * dx + dy * dy)

          if (dist < connectDist) {
            const alpha = 0.12 * (1 - dist / connectDist)
            ctx.beginPath()
            ctx.strokeStyle = `rgba(${RGB}, ${alpha})`
            ctx.lineWidth = 0.7
            ctx.moveTo(a.x, a.y)
            ctx.lineTo(b.x, b.y)
            ctx.stroke()
          }
        }

        ctx.beginPath()
        ctx.arc(a.x, a.y, a.radius, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(${RGB}, 0.35)`
        ctx.fill()

        a.x += a.vx
        a.y += a.vy
        if (a.x < 0 || a.x > width) a.vx *= -1
        if (a.y < 0 || a.y > height) a.vy *= -1
      }

      animId = requestAnimationFrame(draw)
    }

    const handleVisibility = () => {
      if (document.hidden) {
        cancelAnimationFrame(animId)
      } else {
        animId = requestAnimationFrame(draw)
      }
    }

    resize()
    draw()

    window.addEventListener('resize', onResize)
    document.addEventListener('visibilitychange', handleVisibility)

    return () => {
      cancelAnimationFrame(animId)
      if (resizeTimer !== null) window.clearTimeout(resizeTimer)
      window.removeEventListener('resize', onResize)
      document.removeEventListener('visibilitychange', handleVisibility)
    }
  }, [])

  return <canvas ref={canvasRef} className={styles.canvas} aria-hidden="true" />
}
