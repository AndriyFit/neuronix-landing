declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void
    posthog?: {
      capture?: (event: string, props?: Record<string, unknown>) => void
      opt_in_capturing?: () => void
      opt_out_capturing?: () => void
    }
  }
}

export const CONSENT_STORAGE_KEY = 'cookie_consent'

const SIGNALS = ['ad_storage', 'ad_user_data', 'ad_personalization', 'analytics_storage']

// ЄЕЗ + Велика Британія + Швейцарія: там згода обов'язкова до будь-якого запису.
// Решта світу (передусім Україна — основний ринок) стартує з granted, інакше
// вимірювання конверсій розсипається саме там, де крутиться бюджет Ads.
export const STRICT_REGIONS = [
  'AT', 'BE', 'BG', 'HR', 'CY', 'CZ', 'DK', 'EE', 'FI', 'FR', 'DE', 'GR', 'HU', 'IS', 'IE',
  'IT', 'LV', 'LI', 'LT', 'LU', 'MT', 'NL', 'NO', 'PL', 'PT', 'RO', 'SK', 'SI', 'ES', 'SE',
  'GB', 'CH',
]

/** Cookie, яку ставить middleware з `x-vercel-ip-country`. Не httpOnly — читає клієнт. */
export const VISITOR_COUNTRY_COOKIE = 'visitor_country'

/**
 * Чи показувати банер згоди цьому відвідувачу.
 *
 * Банер потрібен лише там, де згода обов'язкова ДО запису — ЄЕЗ, Велика Британія,
 * Швейцарія. Поза цим списком (передусім Україна, основний ринок) consent-дефолт
 * і так `granted`, тож банер нічого не вмикає — він лише дає кнопку «Відхилити».
 * Заміряно 25.08: з чотирьох кліків по банеру три були «Відхилити». Тобто для
 * українського трафіку банер нікого не захищає, а вимірювання вимикає.
 *
 * Невідома країна → показуємо. Заголовка немає на локальній розробці, у прев'ю
 * і якщо Vercel його не проставив; помилитись у бік зайвого банера безпечніше,
 * ніж не показати його там, де він обов'язковий.
 */
export function shouldShowConsentBanner(country: string | null | undefined): boolean {
  if (!country) return true
  return STRICT_REGIONS.includes(country.toUpperCase())
}

const signals = (value: 'granted' | 'denied') =>
  Object.fromEntries(SIGNALS.map((signal) => [signal, value]))

/**
 * Consent Mode v2. Мусить виконатись синхронно ДО gtm.js, тому це інлайн-скрипт
 * у <head>, а не next/script: beforeInteractive в App Router працює лише в root
 * layout, яким тут є pass-through src/app/layout.tsx без <head>.
 */
export const CONSENT_DEFAULT_SNIPPET = [
  'window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments)}',
  `gtag('consent','default',${JSON.stringify({ ...signals('denied'), region: STRICT_REGIONS })});`,
  `gtag('consent','default',${JSON.stringify(signals('granted'))});`,
  `try{if(localStorage.getItem('${CONSENT_STORAGE_KEY}')==='declined')`,
  `{gtag('consent','update',${JSON.stringify(signals('denied'))})}}catch(e){}`,
].join('')

export function updateConsent(granted: boolean) {
  window.gtag?.('consent', 'update', signals(granted ? 'granted' : 'denied'))
  // PostHog сам ЄЕЗ не блокує — рішення приймаємо тільки ми.
  if (granted) window.posthog?.opt_in_capturing?.()
  else window.posthog?.opt_out_capturing?.()
}


/**
 * Повторює збережений вибір при кожному завантаженні, інакше відмова діяла б лише в
 * тій сесії, де людина клікнула банер: повторні відвідувачі банера не бачать.
 *
 * Глушимо ЛИШЕ явну відмову. Відсутність вибору = капчуримо, як і GA поза
 * STRICT_REGIONS: основний ринок — Україна, і глушити її до кліку по банеру означало б
 * втратити вимірювання там, де крутиться бюджет Ads.
 *
 * ponytail: гео-детекції тут немає — кампанія таргетована на UA (geo 2804), відвідувачів
 * з ЄЕЗ одиниці. Знадобиться ЄЕЗ-трафік — вмикати opt_out_capturing_by_default + opt-in.
 */
export const POSTHOG_CONSENT_SNIPPET = [
  `try{if(localStorage.getItem('${CONSENT_STORAGE_KEY}')==='declined')`,
  `{posthog.opt_out_capturing()}}catch(e){}`,
].join('')
