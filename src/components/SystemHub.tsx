'use client'
import { useState } from 'react'
import { useTranslations } from 'next-intl'
import { sendGTMEvent } from '@next/third-parties/google'
import './css/SystemHub.css'

/**
 * Контур систем навколо AI-ядра. Тап збирає контур: звʼязки підсвічуються
 * по черзі. Далі кожен тап — пасхалка з пульсацією ядра.
 *
 * Промінь навколо ядра — border beam, портований з Magic UI у effects.css.
 * Нуль залежностей: SVG плюс CSS.
 */
const VIEWBOX = 520
const CENTER = VIEWBOX / 2
const ORBIT = 180
const NODE_R = 62
const CORE_R = 78
const ANGLES = [0, 60, 120, 180, 240, 300]
const BUILD_STEP_MS = 220

const position = (deg: number) => {
  const rad = (deg * Math.PI) / 180
  return { x: CENTER + ORBIT * Math.cos(rad), y: CENTER - ORBIT * Math.sin(rad) }
}

const toLines = (label: string) => {
  if (label.length <= 10 || !label.includes(' ')) return [label]
  const parts = label.split(' ')
  const mid = Math.ceil(parts.length / 2)
  return [parts.slice(0, mid).join(' '), parts.slice(mid).join(' ')]
}

export default function SystemHub() {
  const t = useTranslations('hero.hub')
  const nodes = t.raw('nodes') as string[]
  const [linked, setLinked] = useState(0)
  const [taps, setTaps] = useState(0)
  const [pulse, setPulse] = useState(false)

  const built = linked >= ANGLES.length

  function handleTap() {
    setTaps((n) => n + 1)

    if (!built) {
      sendGTMEvent({ event: 'hub_tap', hub_action: 'build' })
      ANGLES.forEach((_, i) =>
        window.setTimeout(() => setLinked(i + 1), i * BUILD_STEP_MS),
      )
      return
    }

    sendGTMEvent({ event: 'hub_tap', hub_action: 'pulse' })
    setPulse(true)
    window.setTimeout(() => setPulse(false), 700)
  }

  return (
    <div className="hub">
      <svg className="hub-svg" viewBox={`0 0 ${VIEWBOX} ${VIEWBOX}`} aria-hidden="true">
        <defs>
          <radialGradient id="hubSphere" cx="34%" cy="24%" r="82%">
            <stop offset="0%" stopColor="#ffffff" />
            <stop offset="45%" stopColor="#f7f5ff" />
            <stop offset="100%" stopColor="#e4e0f2" />
          </radialGradient>
          <radialGradient id="hubCore" cx="36%" cy="28%" r="78%">
            <stop offset="0%" stopColor="#a78bfa" />
            <stop offset="45%" stopColor="#7C3AED" />
            <stop offset="100%" stopColor="#5b21b6" />
          </radialGradient>
          <filter id="hubShadow" x="-40%" y="-40%" width="180%" height="180%">
            <feDropShadow dx="0" dy="6" stdDeviation="10" floodColor="#4F46E5" floodOpacity="0.16" />
          </filter>
        </defs>

        {ANGLES.map((angle, i) => {
          const { x, y } = position(angle)
          return (
            <line
              key={`l${i}`}
              className={`hub-line${i < linked ? ' is-linked' : ''}`}
              x1={x}
              y1={y}
              x2={CENTER}
              y2={CENTER}
            />
          )
        })}

        <circle className="hub-halo" cx={CENTER} cy={CENTER} r={CORE_R * 1.36} />
        <g className={`hub-core${pulse ? ' is-pulsing' : ''}`}>
          <circle className="hub-core-sphere" cx={CENTER} cy={CENTER} r={CORE_R} />
          <text className="hub-core-label" x={CENTER} y={CENTER} dy="-0.15em">
            {t('core')
              .split(' ')
              .map((word, i) => (
                <tspan key={i} x={CENTER} dy={i === 0 ? 0 : '1.1em'}>
                  {word}
                </tspan>
              ))}
          </text>
        </g>

        {ANGLES.map((angle, i) => {
          const { x, y } = position(angle)
          const lines = toLines(nodes[i] ?? '')
          return (
            <g key={`n${i}`} className={`hub-node${i < linked ? ' is-linked' : ''}`}>
              <circle className="hub-sphere" cx={x} cy={y} r={NODE_R} />
              <text className="hub-label" x={x} y={y} dy={lines.length > 1 ? '-0.1em' : '0.35em'}>
                {lines.map((line, n) => (
                  <tspan key={n} x={x} dy={n === 0 ? 0 : '1.15em'}>
                    {line}
                  </tspan>
                ))}
              </text>
            </g>
          )
        })}
      </svg>

      <span className="hub-core-beam fx-beam" aria-hidden="true" />

      <button type="button" className="hub-tap" onClick={handleTap} aria-live="polite">
        {built ? t('done') : t('hint')}
      </button>

      <p className={`hub-caption${built ? ' is-visible' : ''}`} aria-live="polite">
        {taps > 4 ? t('easterEgg') : t('doneNote')}
      </p>
    </div>
  )
}
