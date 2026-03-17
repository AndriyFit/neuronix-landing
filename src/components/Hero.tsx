import { useEffect, useRef, useCallback } from 'react'
import gsap from 'gsap'
import './Hero.css'

/* ───────── GLSL Shader Background ───────── */

const vertexShader = `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = vec4(position, 1.0);
  }
`

const fragmentShader = `
  precision highp float;

  uniform float uTime;
  uniform vec2 uMouse;
  uniform vec2 uResolution;

  varying vec2 vUv;

  // Simplex-like noise
  vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
  vec4 mod289(vec4 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
  vec4 permute(vec4 x) { return mod289(((x * 34.0) + 1.0) * x); }
  vec4 taylorInvSqrt(vec4 r) { return 1.79284291400159 - 0.85373472095314 * r; }

  float snoise(vec3 v) {
    const vec2 C = vec2(1.0/6.0, 1.0/3.0);
    const vec4 D = vec4(0.0, 0.5, 1.0, 2.0);

    vec3 i = floor(v + dot(v, C.yyy));
    vec3 x0 = v - i + dot(i, C.xxx);

    vec3 g = step(x0.yzx, x0.xyz);
    vec3 l = 1.0 - g;
    vec3 i1 = min(g.xyz, l.zxy);
    vec3 i2 = max(g.xyz, l.zxy);

    vec3 x1 = x0 - i1 + C.xxx;
    vec3 x2 = x0 - i2 + C.yyy;
    vec3 x3 = x0 - D.yyy;

    i = mod289(i);
    vec4 p = permute(permute(permute(
      i.z + vec4(0.0, i1.z, i2.z, 1.0))
      + i.y + vec4(0.0, i1.y, i2.y, 1.0))
      + i.x + vec4(0.0, i1.x, i2.x, 1.0));

    float n_ = 0.142857142857;
    vec3 ns = n_ * D.wyz - D.xzx;

    vec4 j = p - 49.0 * floor(p * ns.z * ns.z);

    vec4 x_ = floor(j * ns.z);
    vec4 y_ = floor(j - 7.0 * x_);

    vec4 x = x_ * ns.x + ns.yyyy;
    vec4 y = y_ * ns.x + ns.yyyy;
    vec4 h = 1.0 - abs(x) - abs(y);

    vec4 b0 = vec4(x.xy, y.xy);
    vec4 b1 = vec4(x.zw, y.zw);

    vec4 s0 = floor(b0) * 2.0 + 1.0;
    vec4 s1 = floor(b1) * 2.0 + 1.0;
    vec4 sh = -step(h, vec4(0.0));

    vec4 a0 = b0.xzyw + s0.xzyw * sh.xxyy;
    vec4 a1 = b1.xzyw + s1.xzyw * sh.zzww;

    vec3 p0 = vec3(a0.xy, h.x);
    vec3 p1 = vec3(a0.zw, h.y);
    vec3 p2 = vec3(a1.xy, h.z);
    vec3 p3 = vec3(a1.zw, h.w);

    vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2,p2), dot(p3,p3)));
    p0 *= norm.x; p1 *= norm.y; p2 *= norm.z; p3 *= norm.w;

    vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
    m = m * m;
    return 42.0 * dot(m*m, vec4(dot(p0,x0), dot(p1,x1), dot(p2,x2), dot(p3,x3)));
  }

  float fbm(vec3 p) {
    float value = 0.0;
    float amplitude = 0.5;
    float frequency = 1.0;
    for (int i = 0; i < 6; i++) {
      value += amplitude * snoise(p * frequency);
      amplitude *= 0.5;
      frequency *= 2.0;
    }
    return value;
  }

  void main() {
    vec2 uv = vUv;
    vec2 aspect = vec2(uResolution.x / uResolution.y, 1.0);
    vec2 p = (uv - 0.5) * aspect;

    float t = uTime * 0.15;

    // Mouse influence
    vec2 mouseInfluence = (uMouse - 0.5) * 0.3;
    p += mouseInfluence * 0.15;

    // Layer 1: Deep nebula clouds
    float n1 = fbm(vec3(p * 1.8, t * 0.5));
    float n2 = fbm(vec3(p * 2.2 + 3.0, t * 0.4 + 1.0));
    float n3 = fbm(vec3(p * 1.5 - 2.0, t * 0.3 + 2.0));

    // Layer 2: Aurora streams
    float aurora1 = snoise(vec3(p.x * 3.0, p.y * 0.8 + t * 0.6, t * 0.2));
    float aurora2 = snoise(vec3(p.x * 2.5 + 1.5, p.y * 1.2 + t * 0.5, t * 0.25 + 3.0));
    aurora1 = pow(max(aurora1, 0.0), 2.0) * 0.8;
    aurora2 = pow(max(aurora2, 0.0), 2.0) * 0.6;

    // Layer 3: Fine detail particles
    float detail = snoise(vec3(p * 8.0, t * 0.8)) * 0.15;
    float sparkle = pow(max(snoise(vec3(p * 15.0, t * 1.5)), 0.0), 8.0) * 0.4;

    // Brand colors
    vec3 cyan = vec3(0.0, 0.831, 1.0);       // #00D4FF
    vec3 violet = vec3(0.482, 0.184, 1.0);    // #7B2FFF
    vec3 pink = vec3(1.0, 0.176, 0.471);      // #FF2D78
    vec3 deepBlue = vec3(0.02, 0.02, 0.08);   // near bg
    vec3 darkViolet = vec3(0.08, 0.02, 0.15);

    // Mix nebula colors
    vec3 nebula = deepBlue;
    nebula = mix(nebula, darkViolet, smoothstep(-0.2, 0.5, n1) * 0.7);
    nebula = mix(nebula, violet * 0.4, smoothstep(0.0, 0.8, n2) * 0.5);
    nebula = mix(nebula, cyan * 0.3, smoothstep(0.1, 0.7, n3) * 0.4);

    // Add aurora
    nebula += cyan * aurora1 * 0.5;
    nebula += violet * aurora2 * 0.4;
    nebula += pink * aurora1 * aurora2 * 0.6;

    // Add detail and sparkle
    nebula += vec3(0.5, 0.7, 1.0) * detail;
    nebula += cyan * sparkle;
    nebula += pink * pow(max(snoise(vec3(p * 12.0 + 5.0, t * 1.2)), 0.0), 10.0) * 0.3;

    // Central glow (subtle, follows mouse slightly)
    vec2 center = vec2(0.0) + mouseInfluence * 0.1;
    float centralGlow = exp(-length(p - center) * 1.5) * 0.15;
    nebula += mix(cyan, violet, 0.5) * centralGlow;

    // Vignette
    float vignette = 1.0 - length(p) * 0.6;
    vignette = smoothstep(0.0, 1.0, vignette);
    nebula *= vignette;

    // Bottom fade to background
    float bottomFade = smoothstep(0.0, 0.35, uv.y);
    nebula *= bottomFade;

    gl_FragColor = vec4(nebula, 1.0);
  }
`

function ShaderBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const mouseRef = useRef({ x: 0.5, y: 0.5 })
  const rafRef = useRef<number>(0)

  const handleMouseMove = useCallback((e: MouseEvent) => {
    mouseRef.current.x = e.clientX / window.innerWidth
    mouseRef.current.y = 1.0 - e.clientY / window.innerHeight
  }, [])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const gl = canvas.getContext('webgl', { alpha: false, antialias: false })
    if (!gl) return

    // Compile shader
    function createShader(gl: WebGLRenderingContext, type: number, source: string) {
      const shader = gl.createShader(type)!
      gl.shaderSource(shader, source)
      gl.compileShader(shader)
      return shader
    }

    const vs = createShader(gl, gl.VERTEX_SHADER, vertexShader)
    const fs = createShader(gl, gl.FRAGMENT_SHADER, fragmentShader)

    const program = gl.createProgram()!
    gl.attachShader(program, vs)
    gl.attachShader(program, fs)
    gl.linkProgram(program)
    gl.useProgram(program)

    // Fullscreen quad
    const vertices = new Float32Array([
      -1, -1, 0, 0,
       1, -1, 1, 0,
      -1,  1, 0, 1,
       1,  1, 1, 1,
    ])
    const buffer = gl.createBuffer()
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer)
    gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW)

    const posLoc = gl.getAttribLocation(program, 'position')
    const uvLoc = gl.getAttribLocation(program, 'uv')
    gl.enableVertexAttribArray(posLoc)
    gl.enableVertexAttribArray(uvLoc)
    gl.vertexAttribPointer(posLoc, 2, gl.FLOAT, false, 16, 0)
    gl.vertexAttribPointer(uvLoc, 2, gl.FLOAT, false, 16, 8)

    const uTime = gl.getUniformLocation(program, 'uTime')
    const uMouse = gl.getUniformLocation(program, 'uMouse')
    const uResolution = gl.getUniformLocation(program, 'uResolution')

    function resize() {
      const dpr = Math.min(window.devicePixelRatio, 1.5)
      canvas!.width = canvas!.clientWidth * dpr
      canvas!.height = canvas!.clientHeight * dpr
      gl!.viewport(0, 0, canvas!.width, canvas!.height)
    }

    resize()
    window.addEventListener('resize', resize)
    window.addEventListener('mousemove', handleMouseMove)

    const startTime = performance.now()

    function render() {
      const elapsed = (performance.now() - startTime) / 1000
      gl!.uniform1f(uTime, elapsed)
      gl!.uniform2f(uMouse, mouseRef.current.x, mouseRef.current.y)
      gl!.uniform2f(uResolution, canvas!.width, canvas!.height)
      gl!.drawArrays(gl!.TRIANGLE_STRIP, 0, 4)
      rafRef.current = requestAnimationFrame(render)
    }

    rafRef.current = requestAnimationFrame(render)

    return () => {
      cancelAnimationFrame(rafRef.current)
      window.removeEventListener('resize', resize)
      window.removeEventListener('mousemove', handleMouseMove)
    }
  }, [handleMouseMove])

  return <canvas ref={canvasRef} className="hero-shader-canvas" />
}

/* ───────── Neural Network Overlay ───────── */

interface Node {
  x: number
  y: number
  vx: number
  vy: number
  radius: number
  color: string
  alpha: number
}

function NeuralNetwork() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const mouseRef = useRef({ x: -1000, y: -1000 })
  const nodesRef = useRef<Node[]>([])
  const rafRef = useRef<number>(0)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')!

    const colors = ['rgba(0,212,255,', 'rgba(123,47,255,', 'rgba(255,45,120,']
    const nodeCount = 50

    function resize() {
      const dpr = Math.min(window.devicePixelRatio, 2)
      canvas!.width = canvas!.clientWidth * dpr
      canvas!.height = canvas!.clientHeight * dpr
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    }

    function initNodes() {
      const w = canvas!.clientWidth
      const h = canvas!.clientHeight
      nodesRef.current = Array.from({ length: nodeCount }, () => ({
        x: Math.random() * w,
        y: Math.random() * h,
        vx: (Math.random() - 0.5) * 0.4,
        vy: (Math.random() - 0.5) * 0.4,
        radius: 1.5 + Math.random() * 2,
        color: colors[Math.floor(Math.random() * colors.length)],
        alpha: 0.3 + Math.random() * 0.5,
      }))
    }

    resize()
    initNodes()

    const handleResize = () => {
      resize()
      initNodes()
    }
    window.addEventListener('resize', handleResize)

    const handleMouse = (e: MouseEvent) => {
      const rect = canvas!.getBoundingClientRect()
      mouseRef.current.x = e.clientX - rect.left
      mouseRef.current.y = e.clientY - rect.top
    }
    window.addEventListener('mousemove', handleMouse)

    const connectionDist = 150

    function render() {
      const w = canvas!.clientWidth
      const h = canvas!.clientHeight
      ctx.clearRect(0, 0, w, h)

      const nodes = nodesRef.current
      const mx = mouseRef.current.x
      const my = mouseRef.current.y

      // Update positions
      for (const node of nodes) {
        // Mouse repulsion
        const dx = node.x - mx
        const dy = node.y - my
        const dist = Math.sqrt(dx * dx + dy * dy)
        if (dist < 150 && dist > 0) {
          const force = (150 - dist) / 150 * 0.5
          node.vx += (dx / dist) * force
          node.vy += (dy / dist) * force
        }

        node.x += node.vx
        node.y += node.vy

        // Damping
        node.vx *= 0.99
        node.vy *= 0.99

        // Bounce off edges
        if (node.x < 0 || node.x > w) node.vx *= -1
        if (node.y < 0 || node.y > h) node.vy *= -1
        node.x = Math.max(0, Math.min(w, node.x))
        node.y = Math.max(0, Math.min(h, node.y))
      }

      // Draw connections
      ctx.lineWidth = 0.5
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const dx = nodes[i].x - nodes[j].x
          const dy = nodes[i].y - nodes[j].y
          const dist = Math.sqrt(dx * dx + dy * dy)
          if (dist < connectionDist) {
            const opacity = (1 - dist / connectionDist) * 0.2
            ctx.strokeStyle = `rgba(0,212,255,${opacity})`
            ctx.beginPath()
            ctx.moveTo(nodes[i].x, nodes[i].y)
            ctx.lineTo(nodes[j].x, nodes[j].y)
            ctx.stroke()
          }
        }
      }

      // Draw nodes
      for (const node of nodes) {
        // Glow
        ctx.beginPath()
        ctx.arc(node.x, node.y, node.radius * 3, 0, Math.PI * 2)
        ctx.fillStyle = `${node.color}${(node.alpha * 0.15).toFixed(2)})`
        ctx.fill()

        // Core
        ctx.beginPath()
        ctx.arc(node.x, node.y, node.radius, 0, Math.PI * 2)
        ctx.fillStyle = `${node.color}${node.alpha.toFixed(2)})`
        ctx.fill()
      }

      rafRef.current = requestAnimationFrame(render)
    }

    rafRef.current = requestAnimationFrame(render)

    return () => {
      cancelAnimationFrame(rafRef.current)
      window.removeEventListener('resize', handleResize)
      window.removeEventListener('mousemove', handleMouse)
    }
  }, [])

  return <canvas ref={canvasRef} className="hero-neural-canvas" />
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
      <ShaderBackground />
      <NeuralNetwork />

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
