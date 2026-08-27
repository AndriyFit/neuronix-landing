'use client'

import { useEffect, useRef, useState } from 'react'
import { useLocale, useTranslations } from 'next-intl'
import { sendGTMEvent } from '@next/third-parties/google'
import { track } from '@/lib/analytics'
import { parseReply, type Inline } from '@/lib/chat-format'
import { createNdjsonParser } from '@/lib/chat-stream'
import './css/ChatWidget.css'

interface ChatMessage {
  role: 'user' | 'assistant'
  content: string
  leadCreated?: boolean
}

const SESSION_KEY = 'chat_session_id'

// localStorage throws in private/locked-down browsing modes — sessionId still
// works for the current tab, it just won't survive a reload.
function getSessionId(): string {
  try {
    const existing = localStorage.getItem(SESSION_KEY)
    if (existing) return existing
    const id = crypto.randomUUID()
    localStorage.setItem(SESSION_KEY, id)
    return id
  } catch {
    return crypto.randomUUID()
  }
}

// Модель відповідає markdown-ом, і без розбору «**від $350**» показувалось
// людині разом із зірочками. parseReply дає структуру (абзаци, списки, жирний,
// посилання), яку рендеримо звичайними вузлами — ніякого dangerouslySetInnerHTML.
function renderInline(parts: Inline[]) {
  return parts.map((part, i) => {
    if (part.href) {
      return (
        <a key={i} href={part.href} target="_blank" rel="noopener noreferrer">
          {part.text}
        </a>
      )
    }
    return part.bold ? <strong key={i}>{part.text}</strong> : <span key={i}>{part.text}</span>
  })
}

function renderReply(text: string) {
  return parseReply(text).map((block, bi) =>
    block.type === 'ul' ? (
      <ul key={bi}>
        {block.lines.map((line, li) => (
          <li key={li}>{renderInline(line)}</li>
        ))}
      </ul>
    ) : (
      <p key={bi}>
        {block.lines.map((line, li) => (
          // Переноси всередині абзацу модель ставить свідомо — зберігаємо їх.
          <span key={li}>
            {li > 0 && <br />}
            {renderInline(line)}
          </span>
        ))}
      </p>
    )
  )
}

export default function ChatWidget() {
  const t = useTranslations('chat')
  const locale = useLocale()
  const [open, setOpen] = useState(false)
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [input, setInput] = useState('')
  const [sending, setSending] = useState(false)
  const sessionIdRef = useRef<string | null>(null)
  const listRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    sessionIdRef.current = getSessionId()
  }, [])

  // Куди скролити список після наступного рендера. Раніше він завжди їхав у самий
  // низ — і початок довгої відповіді опинявся вище видимої області, тобто людині
  // доводилось прокручувати вгору, щоб знайти, звідки читати. Тепер нова відповідь
  // ставиться ПОЧАТКОМ до верху, а свої повідомлення й далі показуються знизу.
  const scrollModeRef = useRef<'bottom' | 'reply-start'>('bottom')
  // Початок відповіді вже стоїть угорі — далі не чіпаємо скрол узагалі, навіть
  // якщо текст ще росте: інакше ми б перехоплювали керування в людини, яка
  // в цей момент читає й гортає сама.
  const alignedRef = useRef(false)

  // Підтягує початок останньої репліки до верху списку. Один раз цього замало:
  // у момент появи бульбашки прокручувати ще нічого (текст порожній), тож
  // потрібна ціль недосяжна й браузер обрізає scrollTop. Тому вирівнюємо ще й
  // на кожен шматок тексту — рівно доти, доки ціль не досягнута.
  const alignReplyStart = () => {
    const el = listRef.current
    if (!el || alignedRef.current) return
    const last = el.lastElementChild as HTMLElement | null
    if (!last) return
    // offsetTop рахується від .chat-messages — у CSS він position: relative саме заради цього.
    const target = Math.max(0, last.offsetTop - 8)
    if (el.scrollTop >= target) {
      alignedRef.current = true
      return
    }
    el.scrollTop = target
    if (el.scrollTop >= target) alignedRef.current = true
  }

  useEffect(() => {
    // Own scroll container, not window: the page scrolls inside #page-scroll.
    const el = listRef.current
    if (!el) return
    if (scrollModeRef.current === 'reply-start') {
      alignReplyStart()
      return
    }
    el.scrollTop = el.scrollHeight
    // Довжина, не самі повідомлення: під час стрімінгу росте текст останньої
    // репліки, і перескролювання на кожен шматок відбирало б у людини контроль.
  }, [messages.length, sending, open])

  // Привітання показуємо локально, першим відкриттям панелі. У модель воно не
  // йде і в D1 не пишеться: це підказка «з чого почати», а не хід розмови —
  // інакше історія починалася б з репліки, якої ніхто не писав, і кожна сесія
  // коштувала б виклику моделі ще до того, як людина щось спитала.
  useEffect(() => {
    if (open && messages.length === 0) {
      setMessages([{ role: 'assistant', content: t('greeting') }])
    }
  }, [open, messages.length, t])

  // Екранна клавіатура зменшує ЛИШЕ visual viewport, а `position: fixed` рахується
  // від layout viewport — тому панель лишається на місці, і рядок вводу опиняється
  // під клавіатурою. Мета `interactive-widget` тут не рятує: iOS Safari її не
  // підтримує, а саме там проблема найгостріша. Тому міряємо самі й віддаємо
  // геометрію в CSS змінних.
  //
  // Віддаємо ДВА різні описи одного й того ж, бо їх споживають різні медіазапити:
  //   --chat-vv-top / --chat-vv-left / --chat-vv-height / --chat-vv-width —
  //     координати видимого прямокутника; ними телефон (<=600px) прив'язує
  //     панель до visual viewport напряму. Горизонталь потрібна не менше за
  //     вертикаль: при зумі (пінч або авто-зум iOS на полі вводу) видима область
  //     вужча за layout viewport і зсунута вбік;
  //   --chat-keyboard — висота клавіатури; нею планшет/десктоп піднімає панель
  //     над нею, лишаючись карткою в куті.
  // ⚠️ Складати ці два підходи НЕ можна: на iOS Safari браузер сам піднімає
  // сторінку під поле вводу (offsetTop), і другий зсув зверху відриває панель
  // від екрана. Тому в мобільному правилі --chat-keyboard не використовується.
  useEffect(() => {
    const vv = typeof window !== 'undefined' ? window.visualViewport : undefined
    if (!open || !vv) return

    const root = document.documentElement
    const sync = () => {
      root.style.setProperty('--chat-vv-top', `${Math.round(vv.offsetTop)}px`)
      root.style.setProperty('--chat-vv-left', `${Math.round(vv.offsetLeft)}px`)
      root.style.setProperty('--chat-vv-height', `${Math.round(vv.height)}px`)
      root.style.setProperty('--chat-vv-width', `${Math.round(vv.width)}px`)
      // offsetTop враховує зсув, коли Safari «піднімає» сторінку під поле вводу.
      const keyboard = Math.max(0, window.innerHeight - vv.height - vv.offsetTop)
      root.style.setProperty('--chat-keyboard', `${Math.round(keyboard)}px`)
      // Панель щойно стала нижчою — останнє повідомлення інакше лишається
      // вище видимої області, і людина друкує «в порожнечу».
      const list = listRef.current
      if (list) list.scrollTop = list.scrollHeight
    }

    sync()
    vv.addEventListener('resize', sync)
    vv.addEventListener('scroll', sync)
    return () => {
      vv.removeEventListener('resize', sync)
      vv.removeEventListener('scroll', sync)
      root.style.removeProperty('--chat-vv-top')
      root.style.removeProperty('--chat-vv-left')
      root.style.removeProperty('--chat-vv-height')
      root.style.removeProperty('--chat-vv-width')
      root.style.removeProperty('--chat-keyboard')
    }
  }, [open])

  const send = async () => {
    const text = input.trim()
    if (!text || sending) return

    scrollModeRef.current = 'bottom'
    setMessages((prev) => [...prev, { role: 'user', content: text }])
    setInput('')
    setSending(true)
    track('chat_message_sent')

    const fallback = `${t('error')} ${t('telegramFallback')}`

    try {
      const params = new URLSearchParams(window.location.search)
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sessionId: sessionIdRef.current ?? getSessionId(),
          message: text,
          locale,
          landingPath: window.location.pathname,
          // PostHog loads after mount — read the id at send time, not at mount time.
          distinctId: window.posthog?.get_distinct_id?.(),
          utm: {
            source: params.get('utm_source') ?? undefined,
            medium: params.get('utm_medium') ?? undefined,
            campaign: params.get('utm_campaign') ?? undefined,
          },
        }),
      })

      // Успіх приходить потоком NDJSON, помилки — звичайним JSON зі своїм статусом.
      // Розрізняємо за Content-Type, а не за статусом: 503 теж несе готовий reply.
      const streamed = res.ok && res.headers.get('content-type')?.includes('ndjson') && res.body

      if (streamed) {
        const reader = res.body!.getReader()
        const decoder = new TextDecoder()
        const parse = createNdjsonParser()
        let started = false
        let done: { leadCreated?: boolean; contact?: string } = {}

        const push = (text: string) => {
          if (!started) {
            started = true
            // Перший шматок = відповідь пішла: прибираємо «Друкує...» і ставимо
            // початок нової репліки до верху списку.
            scrollModeRef.current = 'reply-start'
            alignedRef.current = false
            setSending(false)
            setMessages((prev) => [...prev, { role: 'assistant', content: text }])
            return
          }
          setMessages((prev) => {
            const next = [...prev]
            const last = next[next.length - 1]
            next[next.length - 1] = { ...last, content: last.content + text }
            return next
          })
          // Після рендера цього шматка: доки початок відповіді не піднявся до
          // верху — підтягуємо. requestAnimationFrame, бо DOM оновлюється не
          // синхронно з setMessages.
          requestAnimationFrame(alignReplyStart)
        }

        for (;;) {
          const { value, done: finished } = await reader.read()
          if (finished) break
          for (const obj of parse(decoder.decode(value, { stream: true }))) {
            if (typeof obj.delta === 'string') push(obj.delta)
            if (obj.done) done = obj as { leadCreated?: boolean; contact?: string }
          }
        }

        if (!started) setMessages((prev) => [...prev, { role: 'assistant', content: fallback }])
        if (done.leadCreated) {
          setMessages((prev) => {
            const next = [...prev]
            next[next.length - 1] = { ...next[next.length - 1], leadCreated: true }
            return next
          })
          // Порядок обов'язковий: sendGTMEvent — гроші, PostHog — аналітика. Збій
          // аналітики не має права завадити конверсії дійти до Google Ads.
          sendGTMEvent({ event: 'generate_lead', lead_source: 'chat' })
          if (done.contact) {
            try {
              window.posthog?.identify?.(done.contact)
            } catch {
              // no-op: аналітика не критична, конверсія критична
            }
          }
          track('chat_lead_submitted')
        }
      } else if (res.ok || res.status === 503) {
        // 503 несе готовий fallback-текст із посиланням на Telegram, зібраний на сервері.
        const data = await res.json()
        scrollModeRef.current = 'reply-start'
        alignedRef.current = false
        setMessages((prev) => [...prev, { role: 'assistant', content: data.reply ?? fallback }])
        if (res.status === 503) track('chat_error', { reason: 'unavailable' })
      } else {
        const errBody: { error?: string } | null = await res.json().catch(() => null)
        track('chat_error', { reason: errBody?.error ?? `http_${res.status}` })
        scrollModeRef.current = 'reply-start'
        alignedRef.current = false
        setMessages((prev) => [...prev, { role: 'assistant', content: fallback }])
      }
    } catch {
      track('chat_error', { reason: 'network' })
      scrollModeRef.current = 'reply-start'
      alignedRef.current = false
      setMessages((prev) => [...prev, { role: 'assistant', content: fallback }])
    } finally {
      setSending(false)
    }
  }

  return (
    <>
      <button
        type="button"
        className={`chat-toggle${open ? ' chat-toggle-active' : ''}`}
        aria-label={open ? t('close') : t('open')}
        aria-expanded={open}
        onClick={() => {
          if (!open) track('chat_opened')
          setOpen((v) => !v)
        }}
      >
        {open ? (
          '×'
        ) : (
          <>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <path d="M4 4h16a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H9l-5 4v-4H4a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2z" />
            </svg>
            {/* Підпис у самій кнопці, а не окремою бульбашкою поруч: інакше це другий
                fixed-елемент у тому ж куті, який довелося б окремо розводити зі
                StickyCta й банером згоди — усе те, що вже налаштовано для .chat-toggle. */}
            <span className="chat-toggle-label">{t('badge')}</span>
          </>
        )}
      </button>

      {open && (
        <div className="chat-panel" role="dialog" aria-modal="true" aria-label={t('title')}>
          <div className="chat-header">
            <div>
              <p className="chat-title">{t('title')}</p>
              <p className="chat-subtitle">{t('subtitle')}</p>
            </div>
            {/* Хрестик — SVG, а не символ «×»: на телефоні панель займає весь екран,
                і це єдиний спосіб повернутись на сайт, тож кнопка не має залежати
                від того, наскільки жирно шрифт малює типографський знак. */}
            <button type="button" className="chat-header-close" aria-label={t('close')} onClick={() => setOpen(false)}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" aria-hidden="true">
                <path d="M6 6l12 12M18 6L6 18" />
              </svg>
            </button>
          </div>

          <div className="chat-messages" ref={listRef}>
            {messages.map((m, i) => (
              <div key={i} className={`chat-bubble chat-bubble-${m.role}`}>
                {renderReply(m.content)}
                {m.leadCreated && <span className="chat-lead-ok">{t('leadOk')}</span>}
              </div>
            ))}
            {sending && <div className="chat-bubble chat-bubble-assistant chat-thinking">{t('thinking')}</div>}
          </div>

          <form
            className="chat-input-row"
            onSubmit={(e) => {
              e.preventDefault()
              send()
            }}
          >
            <input
              type="text"
              className="chat-input"
              placeholder={t('placeholder')}
              aria-label={t('placeholder')}
              value={input}
              maxLength={2000}
              disabled={sending}
              onChange={(e) => setInput(e.target.value)}
            />
            <button type="submit" className="chat-send" disabled={sending || !input.trim()}>
              {t('send')}
            </button>
          </form>

          {/* Другий вихід, крім хрестика в шапці. Потрібен саме на телефоні: там
              панель на весь екран, до шапки треба тягнутись великим пальцем через
              весь екран, а внизу вона ще й найближча до клавіатури. На десктопі
              приховано (CSS) — там панель картка в куті, сайт видно навколо неї. */}
          <button type="button" className="chat-back" onClick={() => setOpen(false)}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M19 12H5M12 19l-7-7 7-7" />
            </svg>
            {t('backToSite')}
          </button>
        </div>
      )}
    </>
  )
}
