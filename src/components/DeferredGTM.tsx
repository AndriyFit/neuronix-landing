'use client'
import { useEffect, useState } from 'react'
import { GoogleTagManager } from '@next/third-parties/google'

// GTM+GA — найважчий шматок критичного шляху (gtag.js + gtm.js разом ~275 КіБ
// transfer, PSI mobile рахує 126,6 КіБ «невикористаним» саме тут). Монтуємо
// GTM пізніше, а не одразу: на першу взаємодію користувача або через FALLBACK_MS,
// якщо взаємодії не було (щоб pageview все одно доїхав).
//
// Це безпечно для конверсій: sendGTMEvent() сам створює window.dataLayer і
// пушить у нього, незалежно від того, чи gtm.js уже завантажився. GTM, коли
// зрештою стартує, обробляє весь накопичений dataLayer з самого початку —
// так офіційно й працює черга GTM. Подія втрачається лише якщо вкладку
// закрили до того, як gtm.js встиг довантажитись.
const FALLBACK_MS = 4000
const TRIGGER_EVENTS = ['pointerdown', 'keydown', 'touchstart', 'scroll'] as const

export default function DeferredGTM({ gtmId }: { gtmId: string }) {
  const [shouldLoad, setShouldLoad] = useState(false)

  useEffect(() => {
    if (shouldLoad) return

    const trigger = () => setShouldLoad(true)
    const timer = window.setTimeout(trigger, FALLBACK_MS)
    TRIGGER_EVENTS.forEach((event) =>
      window.addEventListener(event, trigger, { once: true, passive: true }),
    )

    return () => {
      window.clearTimeout(timer)
      TRIGGER_EVENTS.forEach((event) => window.removeEventListener(event, trigger))
    }
  }, [shouldLoad])

  if (!shouldLoad) return null
  return <GoogleTagManager gtmId={gtmId} />
}
