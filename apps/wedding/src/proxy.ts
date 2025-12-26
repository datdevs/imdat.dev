import type { NextRequest } from 'next/server';

import { NextResponse } from 'next/server';

import { i18n } from './core/i18n/config';

export function proxy(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  const pathnameIsMissingLocale = i18n.locales.every(
    (locale) => !pathname.startsWith(`/${locale}/`) && pathname !== `/${locale}`,
  );

  // Redirect if there is no locale
  if (pathnameIsMissingLocale) {
    const locale = i18n.defaultLocale;
    const newUrl = new URL(`/${locale}${pathname}`, request.url);

    // Set custom request headers
    const requestHeaders = new Headers(request.headers);
    requestHeaders.set('x-lang', locale);

    return NextResponse.redirect(newUrl, {
      headers: requestHeaders,
    });
  }

  // Set custom request headers
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set('x-lang', pathname.split('/')[1]);

  return NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });
}

export const config = {
  // Matcher ignoring `/_next/` and `/api/`
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico|assets|.well-known).*)'],
};
