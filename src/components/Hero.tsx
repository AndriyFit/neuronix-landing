import { useEffect, useRef, useMemo } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'
import gsap from 'gsap'
import './Hero.css'

/* ───────── Particle Field (Three.js) ───────── */

function ParticleField() {
  const points = useRef<THREE.Points>(null!)
  const { mouse } = useThree()

  const particleCount = 2000

  const positions = useMemo(() => {
    const pos = new Float32Array(particleCount * 3)
    for (let i = 0; i < particleCount; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 20
      pos[i * 3 + 1] = (Math.random() - 0.5) * 20
      pos[i * 3 + 2] = (Math.random() - 0.5) * 20
    }
    return pos
  }, [])

  const colors = useMemo(() => {
    const col = new Float32Array(particleCount * 3)
    const cyan = new THREE.Color('#00D4FF')
    const violet = new THREE.Color('#7B2FFF')
    const pink = new THREE.Color('#FF2D78')
    const palette = [cyan, violet, pink]

    for (let i = 0; i < particleCount; i++) {
      const c = palette[Math.floor(Math.random() * palette.length)]
      const mix = 0.3 + Math.random() * 0.7
      col[i * 3] = c.r * mix
      col[i * 3 + 1] = c.g * mix
      col[i * 3 + 2] = c.b * mix
    }
    return col
  }, [])

  useFrame((state) => {
    if (!points.current) return
    const t = state.clock.elapsedTime
    points.current.rotation.x = t * 0.03 + mouse.y * 0.15
    points.current.rotation.y = t * 0.05 + mouse.x * 0.15
  })

  return (
    <points ref={points}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
        />
        <bufferAttribute
          attach="attributes-color"
          args={[colors, 3]}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.04}
        vertexColors
        transparent
        opacity={0.7}
        sizeAttenuation
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  )
}

/* ───────── Hero Section ───────── */

export default function Hero() {
  const titleRef = useRef<HTMLHeadingElement>(null)
  const subtitleRef = useRef<HTMLParagraphElement>(null)
  const ctaRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } })

      tl.from(titleRef.current, {
        y: 60,
        opacity: 0,
        duration: 1,
        delay: 0.4,
      })
      .from(subtitleRef.current, {
        y: 40,
        opacity: 0,
        duration: 0.8,
      }, '-=0.4')
      .from(ctaRef.current, {
        y: 30,
        opacity: 0,
        duration: 0.7,
        onComplete: () => {
          ctaRef.current?.classList.add('hero-cta-glow')
        },
      }, '-=0.3')
    })

    return () => ctx.revert()
  }, [])

  const scrollToContact = () => {
    document.querySelector('#contact')?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <section className="hero" id="hero">
      <div className="hero-canvas">
        <Canvas
          camera={{ position: [0, 0, 8], fov: 60 }}
          dpr={[1, 1.5]}
          gl={{ antialias: false, alpha: true }}
          style={{ background: 'transparent' }}
        >
          <ParticleField />
        </Canvas>
        <div className="hero-canvas-overlay" />
      </div>

      {/* Floating decorative orbs */}
      <div className="hero-orb hero-orb--1" />
      <div className="hero-orb hero-orb--2" />
      <div className="hero-orb hero-orb--3" />

      <div className="hero-content">
        <h1 ref={titleRef} className="hero-title">
          Інтегруємо <span className="hero-title-gradient">інтелект</span> у процеси
        </h1>
        <p ref={subtitleRef} className="hero-subtitle">
          AI автоматизація для малого і середнього бізнесу — голосові агенти,
          чат-боти, сайти, n8n workflow
        </p>
        <button
          ref={ctaRef}
          className="hero-cta"
          onClick={scrollToContact}
        >
          Отримати консультацію
        </button>
      </div>

      <div className="hero-scroll-indicator">
        <span>Scroll</span>
        <div className="hero-scroll-arrow" />
      </div>
    </section>
  )
}
