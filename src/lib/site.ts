import { defaultLocale, type Locale } from '@/i18n/config'

/**
 * Canonical origin of the site. Single source of truth.
 *
 * This used to be copy-pasted into six files and drifted to a domain that
 * does not exist (neuronix.work), which sent every canonical, og:url and
 * sitemap entry to nowhere. Import from here — do not redeclare.
 */
export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://neuronics.work'

/**
 * Абсолютний URL сторінки з урахуванням `localePrefix: 'as-needed'`:
 * українська без префікса (`/blog`), решта локалей — з ним (`/en/blog`).
 *
 * Той самий хардкод `${SITE_URL}/${locale}` раніше лежав у шести файлах, і при переїзді
 * з /uk на корінь кожен довелося б правити однаково. Будуй URL лише через цю функцію.
 *
 * Головна української — це голий origin (`https://neuronics.work`). Кінцевий слеш не
 * додаємо: Next однаково нормалізує вивід сам — у canonical слеш зрізає, у sitemap
 * дописує. Обидві форми Google вважає тим самим URL.
 */
export function localeUrl(locale: Locale | string, path = ''): string {
  const prefix = locale === defaultLocale ? '' : `/${locale}`
  return `${SITE_URL}${prefix}${path}`
}
