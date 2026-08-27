'use client'

import { useEffect, useRef, useState } from 'react'
import { useLocale, useTranslations } from 'next-intl'
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

// /api/chat replies (incl. the 503 fallback) embed a plain t.me URL, not markdown —
// linkify so it's an actual tappable link rather than inert text.
function linkify(text: string) {
  return text.split(/(https?:\/\/\S+)/g).map((part, i) =>
    /^https?:\/\//.test(part) ? (
      <a key={i} href={part} target="_blank" rel="noopener noreferrer">
        {part}
      </a>
    ) : (
      part
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

  useEffect(() => {
    // Own scroll container, not window: the page scrolls inside #page-scroll.
    const el = listRef.current
    if (el) el.scrollTop = el.scrollHeight
  }, [messages, sending, open])

  const send = async () => {
    const text = input.trim()
    if (!text || sending) return

    setMessages((prev) => [...prev, { role: 'user', content: text }])
    setInput('')
    setSending(true)

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

      // 200 and 503 both carry `reply` — 503's already has the Telegram fallback text
      // baked in server-side. Everything else (400, 429, ...) has no reply field: the
      // route's one real failure mode with no built-in fallback, so we supply our own.
      if (res.ok || res.status === 503) {
        const data = await res.json()
        setMessages((prev) => [
          ...prev,
          { role: 'assistant', content: data.reply ?? fallback, leadCreated: data.leadCreated },
        ])
      } else {
        setMessages((prev) => [...prev, { role: 'assistant', content: fallback }])
      }
    } catch {
      setMessages((prev) => [...prev, { role: 'assistant', content: fallback }])
    } finally {
      setSending(false)
    }
  }

  return (
    <>
      <button
        type="button"
        className="chat-toggle"
        aria-label={open ? t('close') : t('open')}
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
      >
        {open ? (
          '×'
        ) : (
          <svg width="26" height="26" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
            <path d="M4 4h16a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H9l-5 4v-4H4a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2z" />
          </svg>
        )}
      </button>

      {open && (
        <div className="chat-panel" role="dialog" aria-label={t('title')}>
          <div className="chat-header">
            <div>
              <p className="chat-title">{t('title')}</p>
              <p className="chat-subtitle">{t('subtitle')}</p>
            </div>
            <button type="button" className="chat-header-close" aria-label={t('close')} onClick={() => setOpen(false)}>
              ×
            </button>
          </div>

          <div className="chat-messages" ref={listRef}>
            {messages.map((m, i) => (
              <div key={i} className={`chat-bubble chat-bubble-${m.role}`}>
                <p>{linkify(m.content)}</p>
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
              value={input}
              maxLength={2000}
              disabled={sending}
              onChange={(e) => setInput(e.target.value)}
            />
            <button type="submit" className="chat-send" disabled={sending || !input.trim()}>
              {t('send')}
            </button>
          </form>
        </div>
      )}
    </>
  )
}
