import createMiddleware from 'next-intl/middleware'
import { routing } from './i18n/routing'

export default createMiddleware(routing)

export const config = {
  matcher: [
    '/((?!_next|_vercel|api|icon|apple-icon|opengraph-image|twitter-image|sitemap|robots|manifest|.*\\..*).*)'],
}
