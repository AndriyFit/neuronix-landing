import createMiddleware from 'next-intl/middleware'
import { routing } from './i18n/routing'

export default createMiddleware(routing)

export const config = {
  // З localePrefix: 'as-needed' українські шляхи йдуть без префікса (`/blog`,
  // `/privacy-policy`), тож вузький матчер на `/(uk|en)/:path*` їх би не покрив.
  // `.*\\..*` лишає поза middleware все з крапкою у шляху: robots.txt, sitemap.xml,
  // favicon.svg, google*.html і згенеровані opengraph-image-*.png.
  matcher: ['/((?!api|_next|_vercel|.*\\..*).*)'],
}
