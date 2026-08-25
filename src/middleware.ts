import createMiddleware from 'next-intl/middleware'
import type { NextRequest } from 'next/server'
import { routing } from './i18n/routing'
import { VISITOR_COUNTRY_COOKIE } from './lib/consent'

const intlMiddleware = createMiddleware(routing)

export default function middleware(request: NextRequest) {
  const response = intlMiddleware(request)

  // Країну віддає Vercel на краю мережі. Кладемо її в cookie, а не читаємо headers()
  // у layout: headers() перевів би всі сторінки в динамічний рендер і забрав SSG.
  // Сама cookie strictly necessary — без неї не можна вирішити, чи потрібна згода.
  const country = request.headers.get('x-vercel-ip-country')
  if (country) {
    response.cookies.set(VISITOR_COUNTRY_COOKIE, country, {
      path: '/',
      maxAge: 60 * 60 * 24,
      sameSite: 'lax',
    })
  }

  return response
}

export const config = {
  // '/' навмисно поза matcher: постійний 308 на /uk робить next.config redirects
  // (middleware next-intl уміє лише тимчасовий 307).
  matcher: ['/(uk|en)/:path*'],
}
