// Copyright © Todd Agriscience, Inc. All rights reserved.

import { SUPPORTED_LOCALES } from '@/i18n/config';
import { NextRequest, NextResponse } from 'next/server';
import type { Locale } from 'next-intl';

/**
 * Early routing tweaks before auth/i18n.
 *
 * **`/careers/index`**: Next.js App Router treats a segment folder literally named `index` under
 * `careers` as the **default child** of `/careers`, so it cannot power the distinct URL
 * `/careers/index` while `careers/page.tsx` owns `/careers`. We **rewrite** (URL unchanged)
 * `/{locale}/careers/index` → internal `/{locale}/careers/listings`, where the listing UI lives.
 *
 * **`/careers/listings`**: Redirect **`308`** to **`/careers/index`** so the listing URL stays canonical.
 *
 * @param request - Incoming request
 */
export default function specialRedirect(
  request: NextRequest
): NextResponse | null {
  const pathname = request.nextUrl.pathname.replace(/\/+$/, '') || '/';
  const segments = pathname.split('/').filter(Boolean);

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

  if (
    segments.length === 3 &&
    isLocale &&
    segments[1] === 'careers' &&
    segments[2] === 'listings'
  ) {
    return NextResponse.redirect(
      new URL(`/${locale0}/careers/index`, request.url),
      308
    );
  }

  if (
    segments.length === 3 &&
    isLocale &&
    segments[1] === 'careers' &&
    segments[2] === 'index'
  ) {
    const url = request.nextUrl.clone();
    url.pathname = `/${locale0}/careers/listings`;
    return NextResponse.rewrite(url);
  }

  return null;
}
