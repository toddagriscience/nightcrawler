// Copyright © Todd Agriscience, Inc. All rights reserved.

import { SUPPORTED_LOCALES } from '@/i18n/config';
import { NextRequest, NextResponse } from 'next/server';
import type { Locale } from 'next-intl';

/**
 * Early routing tweaks before auth/i18n.
 *
 * Careers hub and job listings live under `app/(unauthenticated)/[locale]/(marketing)/careers/` as
 * normal routes (`/careers` and `/careers/index`); no rewrite is applied here.
 *
 * @param request - Incoming request
 */
export default function specialRedirect(
  request: NextRequest
): NextResponse | null {
  const pathname = request.nextUrl.pathname.replace(/\/+$/, '') || '/';
  const segments = pathname.split('/').filter(Boolean);

  if (pathname === '/iris') {
    return NextResponse.redirect(
      new URL('/index/introducing-iris', request.url)
    );
  }

  const locale0 = segments[0];
  const isLocale =
    locale0 !== undefined && SUPPORTED_LOCALES.includes(locale0 as Locale);

  if (
    segments.length === 3 &&
    isLocale &&
    segments[1] === 'careers' &&
    segments[2] === 'externship'
  ) {
    return NextResponse.redirect(
      // eslint-disable-next-line no-secrets/no-secrets
      'https://docs.google.com/forms/d/e/1FAIpQLSfi8yeNdjHuJCrO1sPSUhh8uCICsA6KGevRM-Mk9iND-aYkBQ/viewform'
    );
  }

  return null;
}
