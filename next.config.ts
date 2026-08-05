// next.config.ts
import createNextIntlPlugin from 'next-intl/plugin'

const withNextIntl = createNextIntlPlugin('./src/i18n/request.ts')

const nextConfig = {
  // Vercel default output — compatible with middleware

  // Блог існує лише українською: getPostBySlug локаль ігнорує, тож /en/blog/* віддавав
  // той самий український текст із власним canonical — чистий дубль для Google.
  // 301 замість 404, щоб не втратити сигнали з уже проіндексованих URL.
  async redirects() {
    return [
      { source: '/en/blog', destination: '/uk/blog', permanent: true },
      { source: '/en/blog/:slug', destination: '/uk/blog/:slug', permanent: true },
    ]
  },
}

export default withNextIntl(nextConfig)
