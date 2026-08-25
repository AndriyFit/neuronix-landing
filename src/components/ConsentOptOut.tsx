'use client'

import { useEffect, useState } from 'react'
import { useTranslations } from 'next-intl'
import { CONSENT_STORAGE_KEY, updateConsent } from '@/lib/consent'

/**
 * Кнопка відмови на сторінці політики.
 *
 * Навіщо окремо від банера: банер показується лише там, де згода обов'язкова до
 * запису (ЄЕЗ, Велика Британія, Швейцарія). Для решти відвідувачів він прибраний —
 * він нічого не вмикав, лише вимикав вимірювання. Але право відмовитись мусить
 * лишитись у всіх, тому воно живе тут: не нав'язується, але доступне з політики,
 * на яку є посилання в кожному футері.
 */
export default function ConsentOptOut() {
  const t = useTranslations('cookie')
  const [choice, setChoice] = useState<string | null>(null)

  useEffect(() => {
    try {
      setChoice(localStorage.getItem(CONSENT_STORAGE_KEY))
    } catch {
      // приватний режим / заблоковане сховище — кнопка просто покаже стан за замовчуванням
    }
  }, [])

  function set(granted: boolean) {
    try {
      localStorage.setItem(CONSENT_STORAGE_KEY, granted ? 'accepted' : 'declined')
    } catch {
      // не змогли запам'ятати вибір — сигнал усе одно надсилаємо в цій сесії
    }
    updateConsent(granted)
    setChoice(granted ? 'accepted' : 'declined')
  }

  const declined = choice === 'declined'

  return (
    <p style={{ marginTop: '0.75rem' }}>
      <button
        type="button"
        onClick={() => set(declined)}
        style={{
          padding: '0.6rem 1.1rem',
          borderRadius: '0.5rem',
          border: '1px solid currentColor',
          background: 'transparent',
          color: 'inherit',
          font: 'inherit',
          cursor: 'pointer',
        }}
      >
        {declined ? t('optIn') : t('optOut')}
      </button>
      {declined && (
        <span style={{ marginLeft: '0.75rem', opacity: 0.75 }}>{t('optedOut')}</span>
      )}
    </p>
  )
}
