

// middleware.ts
import { NextRequest, NextResponse } from 'next/server';

const PUBLIC_FILE = /\.(.*)$/;
const SUPPORTED_LOCALES = ['en', 'ar'];
const DEFAULT_LOCALE = 'en';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Skip internal/public files or already localized routes
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api') ||
    PUBLIC_FILE.test(pathname) ||
    SUPPORTED_LOCALES.some((locale) => pathname.startsWith(`/${locale}`))
  ) {
    return NextResponse.next();
  }

  // Detect language
  const langHeader = request.headers.get('accept-language');
  const preferredLang = langHeader?.split(',')?.[0]?.split('-')[0] || DEFAULT_LOCALE;

  const locale = SUPPORTED_LOCALES.includes(preferredLang) ? preferredLang : DEFAULT_LOCALE;

  const url = request.nextUrl.clone();
  url.pathname = `/${locale}${pathname}`;

  return NextResponse.redirect(url);
}
