import { defineRouting } from 'next-intl/routing'
import { locales, defaultLocale } from './config'

export const routing = defineRouting({
  locales,
  defaultLocale,

  // Українська живе на `/`, англійська — на `/en`. Раніше було 'always', і корінь
  // neuronics.work/ назавжди лишався 307-редіректом на /uk: Search Console рапортував
  // «Сторінка з переспрямуванням», а сама брендова адреса не мала шансу потрапити в індекс.
  localePrefix: 'as-needed',

  // Без цього next-intl визначає локаль із заголовка Accept-Language. Googlebot часто
  // краулить з `Accept-Language: en` — і корінь редіректив би вже на /en, тобто те саме
  // зауваження в інший бік. Локаль перемикається лише явно, через LanguageSwitcher.
  localeDetection: false,
})
