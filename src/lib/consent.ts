declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void
    clarity?: (...args: unknown[]) => void
  }
}

export const CONSENT_STORAGE_KEY = 'cookie_consent'

const SIGNALS = ['ad_storage', 'ad_user_data', 'ad_personalization', 'analytics_storage']

// ЄЕЗ + Велика Британія + Швейцарія: там згода обов'язкова до будь-якого запису.
// Решта світу (передусім Україна — основний ринок) стартує з granted, інакше
// вимірювання конверсій розсипається саме там, де крутиться бюджет Ads.
const STRICT_REGIONS = [
  'AT', 'BE', 'BG', 'HR', 'CY', 'CZ', 'DK', 'EE', 'FI', 'FR', 'DE', 'GR', 'HU', 'IS', 'IE',
  'IT', 'LV', 'LI', 'LT', 'LU', 'MT', 'NL', 'NO', 'PL', 'PT', 'RO', 'SK', 'SI', 'ES', 'SE',
  'GB', 'CH',
]

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

// Clarity, consentv2. Капіталізація ad_Storage / analytics_Storage саме така в
// офіційній доці — виглядає як помилка, але це реальні імена полів, не чіпати.
// Старий clarity('consent', bool) задепрекейчено.
const clarityConsent = (granted: boolean) => {
  const value = granted ? 'granted' : 'denied'
  return { ad_Storage: value, analytics_Storage: value }
}

export function updateConsent(granted: boolean) {
  window.gtag?.('consent', 'update', signals(granted ? 'granted' : 'denied'))
  window.clarity?.('consentv2', clarityConsent(granted))
}

/**
 * Повторює збережений вибір при кожному завантаженні сторінки. Без цього сигнал
 * ішов би лише в ту сесію, де людина клікнула банер: повторні відвідувачі банера
 * не бачать, тож Clarity не дізнавався б про їхню згоду ніколи.
 *
 * Якщо вибору ще немає — не шлемо нічого свідомо. Clarity сам тримає ЄЕЗ/UK/CH у
 * режимі без згоди (з 31.10.2025), і надіслати туди 'granted' за людину, яка
 * нічого не натискала, було б брехнею.
 */
export const CLARITY_CONSENT_REPLAY_SNIPPET = [
  `try{var c=localStorage.getItem('${CONSENT_STORAGE_KEY}');`,
  `if(c==='accepted'||c==='declined'){var v=c==='accepted'?'granted':'denied';`,
  `clarity('consentv2',{ad_Storage:v,analytics_Storage:v})}}catch(e){}`,
].join('')
