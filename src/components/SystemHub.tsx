'use client'
import { useTranslations } from 'next-intl'
import './css/SystemHub.css'

/**
 * Контур систем навколо AI-ядра. Свідомо SVG, а не відео: підписи лишаються
 * справжнім текстом — їх бачить Google, читає скрінрідер і перекладає i18n,
 * а вага замість сотень кілобайт вимірюється одиницями.
 */
const VIEWBOX = 520
const CENTER = VIEWBOX / 2
const ORBIT = 180
const NODE_R = 62
const CORE_R = 74

// Правильний шестикутник: 0° праворуч, далі проти годинникової.
const ANGLES = [0, 60, 120, 180, 240, 300]

const position = (angleDeg: number) => {
  const rad = (angleDeg * Math.PI) / 180
  return {
    x: CENTER + ORBIT * Math.cos(rad),
    y: CENTER - ORBIT * Math.sin(rad),
  }
}

// Довгі підписи не влазять у сферу — ріжемо на два рядки по пробілу.
const toLines = (label: string) => {
  if (label.length <= 10 || !label.includes(' ')) return [label]
  const parts = label.split(' ')
  const mid = Math.ceil(parts.length / 2)
  return [parts.slice(0, mid).join(' '), parts.slice(mid).join(' ')]
}

export default function SystemHub() {
  const t = useTranslations('hero.hub')
  const nodes = t.raw('nodes') as string[]

  return (
    <div className="hub">
      <svg
        className="hub-svg"
        viewBox={`0 0 ${VIEWBOX} ${VIEWBOX}`}
        role="img"
        aria-label={t('alt')}
      >
        <defs>
          <radialGradient id="hubSphere" cx="35%" cy="28%" r="75%">
            <stop offset="0%" stopColor="#ffffff" />
            <stop offset="55%" stopColor="#f1eefc" />
            <stop offset="100%" stopColor="#d9d2f0" />
          </radialGradient>
          <radialGradient id="hubCore" cx="40%" cy="32%" r="72%">
            <stop offset="0%" stopColor="#c4b1fb" />
            <stop offset="55%" stopColor="#7C3AED" />
            <stop offset="100%" stopColor="#4F46E5" />
          </radialGradient>
        </defs>

        {ANGLES.map((angle, i) => {
          const { x, y } = position(angle)
          return (
            <line
              key={`line-${i}`}
              className="hub-line"
              x1={x}
              y1={y}
              x2={CENTER}
              y2={CENTER}
              style={{ animationDelay: `${i * 0.35}s` }}
            />
          )
        })}

        <circle className="hub-core-glow" cx={CENTER} cy={CENTER} r={CORE_R} />
        <circle className="hub-core" cx={CENTER} cy={CENTER} r={CORE_R} />
        <text className="hub-core-label" x={CENTER} y={CENTER} dy="0.36em">
          {t('core')}
        </text>

        {ANGLES.map((angle, i) => {
          const { x, y } = position(angle)
          const lines = toLines(nodes[i] ?? '')
          return (
            <g
              key={`node-${i}`}
              className="hub-node"
              style={{ animationDelay: `${i * 0.5}s` }}
            >
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
    </div>
  )
}
