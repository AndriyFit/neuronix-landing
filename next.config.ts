// next.config.ts
import createNextIntlPlugin from 'next-intl/plugin'

const withNextIntl = createNextIntlPlugin('./src/i18n/request.ts')

const nextConfig = {
  // Vercel default output — compatible with middleware

  // Редіректи з next.config виконуються ДО middleware — це навмисно.
  // next-intl на префіксований шлях дефолтної локалі віддає 307 (тимчасовий), а /uk
  // уже був проіндексований: тимчасовий редірект не консолідує сигнали на новий URL.
  // Тому постійні 308 оголошені тут, і middleware цих шляхів навіть не бачить.
  async redirects() {
    return [
      // Українська переїхала з /uk на корінь (localePrefix: 'as-needed').
      // Два правила замість одного, щоб не покладатись на те, як :path* матчить порожній хвіст.
      { source: '/uk', destination: '/', permanent: true },
      { source: '/uk/:path*', destination: '/:path*', permanent: true },

      // Блог існує лише українською: getPostBySlug локаль ігнорує, тож /en/blog/* віддавав
      // той самий український текст із власним canonical — чистий дубль для Google.
      { source: '/en/blog', destination: '/blog', permanent: true },
      { source: '/en/blog/:slug', destination: '/blog/:slug', permanent: true },
    ]
  },
}

export default withNextIntl(nextConfig)
