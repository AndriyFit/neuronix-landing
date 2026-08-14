// next.config.ts
import createNextIntlPlugin from 'next-intl/plugin'

const withNextIntl = createNextIntlPlugin('./src/i18n/request.ts')

const nextConfig = {
  // Vercel default output — compatible with middleware

  // Редіректи /en/blog → /uk/blog прибрано 2026-08-09: англійські статті тепер існують
  // (src/content/blog/en/), тож /en/blog/* віддає власний контент із власним canonical.
  async redirects() {
    return [
      // Корінь віддавав 307 (тимчасовий) від next-intl middleware — GSC показував це
      // як «Сторінка з переспрямуванням» і не консолідував сигнали на /uk.
      // 308 = постійний: вага зовнішніх посилань на neuronics.work іде на /uk.
      { source: '/', destination: '/uk', permanent: true },
    ]
  },

  // Презентація для партнерів Cornix — статична сторінка з public/, поза i18n-роутингом
  // (middleware matcher ловить лише /uk|/en, тож сюди не втручається).
  async rewrites() {
    return [{ source: '/cornix', destination: '/cornix/index.html' }]
  },
}

export default withNextIntl(nextConfig)
