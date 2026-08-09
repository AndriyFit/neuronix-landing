import createMiddleware from 'next-intl/middleware'
import { routing } from './i18n/routing'

export default createMiddleware(routing)

export const config = {
  // '/' навмисно поза matcher: постійний 308 на /uk робить next.config redirects
  // (middleware next-intl уміє лише тимчасовий 307).
  matcher: ['/(uk|en)/:path*'],
}
