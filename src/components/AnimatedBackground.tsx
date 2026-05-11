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

const COUNT = 75
const CONNECT_DIST = 130
const SPEED = 0.28
const RGB = '124, 58, 237' // #7C3AED

export default function AnimatedBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    // Respect prefers-reduced-motion
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    let animId: number
    let particles: Particle[] = []

    const resize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
      particles = Array.from({ length: COUNT }, () => ({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * SPEED,
        vy: (Math.random() - 0.5) * SPEED,
        radius: Math.random() * 1.5 + 0.8,
      }))
    }

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      for (let i = 0; i < particles.length; i++) {
        const a = particles[i]

        for (let j = i + 1; j < particles.length; j++) {
          const b = particles[j]
          const dx = a.x - b.x
          const dy = a.y - b.y
          const dist = Math.sqrt(dx * dx + dy * dy)

          if (dist < CONNECT_DIST) {
            const alpha = 0.12 * (1 - dist / CONNECT_DIST)
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
        if (a.x < 0 || a.x > canvas.width) a.vx *= -1
        if (a.y < 0 || a.y > canvas.height) a.vy *= -1
      }

      animId = requestAnimationFrame(draw)
    }

    resize()
    draw()

    window.addEventListener('resize', resize)
    return () => {
      cancelAnimationFrame(animId)
      window.removeEventListener('resize', resize)
    }
  }, [])

  return <canvas ref={canvasRef} className={styles.canvas} aria-hidden="true" />
}
