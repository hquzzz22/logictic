import createMiddleware from 'next-intl/middleware';
import {routing} from './i18n/routing';

export default createMiddleware(routing);

export const config = {
  // Skip all paths that should not be internationalized.
  // This skips /api, /_next, /_vercel, static files with dots, and the /admin route.
  matcher: ['/((?!api|_next|_vercel|admin|.*\\..*).*)']
};
