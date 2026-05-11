'use client'

import { useEffect, useRef, useState } from 'react'
import styles from './AnimatedTerminal.module.css'

interface Line {
  prompt: string
  text: string
  type: 'cmd' | 'info' | 'success'
}

const LINES: Line[] = [
  { prompt: '$', text: 'ai analyze --site client.ua', type: 'cmd' },
  { prompt: '›', text: 'Сканування 247 сторінок...', type: 'info' },
  { prompt: '✓', text: 'SEO score: 23 → 87', type: 'success' },
  { prompt: '$', text: 'ai generate --content --seo', type: 'cmd' },
  { prompt: '›', text: 'Генерую мета-теги та структуру...', type: 'info' },
  { prompt: '✓', text: 'Контент оптимізовано', type: 'success' },
  { prompt: '$', text: 'deploy --prod --cdn cloudflare', type: 'cmd' },
  { prompt: '✓', text: 'Сайт запущено. Трафік +340%', type: 'success' },
]

const CHAR_DELAY = 28
const LINE_PAUSE = 380
const LOOP_PAUSE = 2200

export default function AnimatedTerminal() {
  const [visibleLines, setVisibleLines] = useState<{ prompt: string; text: string; type: string; done: boolean }[]>([])
  const [typing, setTyping] = useState('')
  const rafRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    let cancelled = false

    async function sleep(ms: number) {
      return new Promise<void>((res) => { rafRef.current = setTimeout(res, ms) })
    }

    async function run() {
      while (!cancelled) {
        setVisibleLines([])
        setTyping('')
        await sleep(400)

        for (const line of LINES) {
          if (cancelled) return

          // type chars
          let partial = ''
          for (const ch of line.text) {
            if (cancelled) return
            partial += ch
            setTyping(partial)
            await sleep(CHAR_DELAY)
          }

          setVisibleLines((prev) => [...prev, { ...line, done: true }])
          setTyping('')
          await sleep(LINE_PAUSE)
        }

        await sleep(LOOP_PAUSE)
      }
    }

    run()
    return () => {
      cancelled = true
      if (rafRef.current) clearTimeout(rafRef.current)
    }
  }, [])

  const currentLineIndex = visibleLines.length

  return (
    <div className={styles.terminal}>
      <div className={styles.header}>
        <span className={styles.dot} data-color="red" />
        <span className={styles.dot} data-color="yellow" />
        <span className={styles.dot} data-color="green" />
        <span className={styles.title}>neuronix — ai agent</span>
      </div>
      <div className={styles.body}>
        {visibleLines.map((line, i) => (
          <div key={i} className={`${styles.line} ${styles[line.type]}`}>
            <span className={styles.prompt}>{line.prompt}</span>
            <span>{line.text}</span>
          </div>
        ))}
        {typing && (
          <div className={`${styles.line} ${styles[LINES[currentLineIndex]?.type ?? 'cmd']}`}>
            <span className={styles.prompt}>{LINES[currentLineIndex]?.prompt}</span>
            <span>{typing}<span className={styles.cursor} /></span>
          </div>
        )}
      </div>
    </div>
  )
}
