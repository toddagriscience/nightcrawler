// Copyright © Todd Agriscience, Inc. All rights reserved.

import { NextRequest, NextResponse } from 'next/server';
import {
  getArticleRoutingInfo,
  getPublicDocumentId,
} from '@/lib/sanity/articles';
import { getLocalizedPath } from '@/lib/canonical-urls';
import { logger } from '@/lib/logger';
import { isKnownPublicRoute } from './proxy/public-routes';
import {
  applyPrivacyControls,
  ensureNextResponse,
  handleI18nMiddleware,
  hasGPCEnabled,
} from './proxy/export';
import { handleAuthRouting } from './proxy/auth';
import isAllUserRoute from './proxy/all-users-page';
import specialRedirect from './proxy/special-redirect';

/**
 * Proxy for internationalization, authorization, and privacy controls.
 * Runs careers-specific routing first (`special-redirect`: externship redirect).
 * Handles Global Privacy Control (GPC) signals and privacy preferences.
 * @param {NextRequest} request - The request object
 * @returns {NextResponse} - The response object
 */
export default async function proxy(request: NextRequest) {
  const shouldSpecialRedirect = specialRedirect(request);

  if (shouldSpecialRedirect) {
    return shouldSpecialRedirect;
  }

  // Check for Global Privacy Control (GPC) signal
  const gpcEnabled = hasGPCEnabled(request);

  const canAllAccess = await isAllUserRoute(request);

  // Handle authentication-based routing
  if (!canAllAccess) {
    const authRedirect = await handleAuthRouting(request);
    if (authRedirect) {
      return authRedirect;
    }
  }

  // Run the internationalization middleware for unauthenticated users only
  const intlResponse = handleI18nMiddleware(request, false);

  if (
    !isKnownPublicRoute(request.nextUrl.pathname) &&
    !intlResponse.headers.has('location')
  ) {
    const target = new URL('/__public-not-found/unmatched', request.url);
    return applyPrivacyControls(
      request,
      NextResponse.rewrite(new URL(target), {
        status: 404,
        headers: intlResponse.headers,
      }),
      gpcEnabled
    );
  }

  // Missing resources rewrite to an unmatched route so the global 404 is used.
  // Rewriting to the original route lets its prerendered shell replace the status
  // with 200 even when the dynamic page later calls notFound().

  // Check CMS existence before a Suspense boundary can stream a 200 response.
  // Untranslated Spanish entry points deliberately redirect to the English
  // publication; they never expose English content at an indexable Spanish URL.
  const articleRoute = request.nextUrl.pathname.match(
    /^\/(?:(en|es)\/)?(index|news|careers)\/([^/]+)$/
  );
  const documentRoute = request.nextUrl.pathname.match(
    /^\/(?:(en|es)\/)?(about|forms)\/([^/]+)$/
  );
  if (documentRoute && !intlResponse.headers.has('location')) {
    try {
      const id = await getPublicDocumentId(
        documentRoute[2] === 'about' ? 'governance-profiles' : 'form',
        decodeURIComponent(documentRoute[3])
      );
      if (!id) {
        const target = new URL('/__public-not-found/unmatched', request.url);
        return applyPrivacyControls(
          request,
          NextResponse.rewrite(new URL(target), {
            status: 404,
            headers: intlResponse.headers,
          }),
          gpcEnabled
        );
      }
    } catch (error) {
      logger.error('Unable to verify published public document', error);
      return NextResponse.json(
        { error: 'Service temporarily unavailable' },
        { status: 503 }
      );
    }
  }
  if (
    articleRoute &&
    !intlResponse.headers.has('location') &&
    !(articleRoute[2] === 'careers' && articleRoute[3] === 'search')
  ) {
    const locale = articleRoute[1] ?? 'en';
    try {
      const slug = decodeURIComponent(articleRoute[3]);
      const article = await getArticleRoutingInfo(
        slug,
        locale,
        articleRoute[2] === 'careers' ? { cache: 'no-store' } : undefined
      );
      if (
        !article ||
        (articleRoute[2] === 'careers' && article._type !== 'career')
      ) {
        if (locale === 'es') {
          const englishArticle = await getArticleRoutingInfo(
            slug,
            'en',
            articleRoute[2] === 'careers' ? { cache: 'no-store' } : undefined
          );
          if (
            englishArticle &&
            (articleRoute[2] !== 'careers' || englishArticle._type === 'career')
          ) {
            const path =
              englishArticle._type === 'career'
                ? `/careers/${slug}`
                : `/index/${slug}`;
            return applyPrivacyControls(
              request,
              NextResponse.redirect(
                new URL(getLocalizedPath(path), request.url)
              ),
              gpcEnabled
            );
          }
        }
        const target = new URL('/__public-not-found/unmatched', request.url);
        return applyPrivacyControls(
          request,
          NextResponse.rewrite(new URL(target), {
            status: 404,
            headers: intlResponse.headers,
          }),
          gpcEnabled
        );
      }
    } catch (error) {
      logger.error('Unable to verify published article route', error);
      return NextResponse.json(
        { error: 'Service temporarily unavailable' },
        { status: 503 }
      );
    }
  }

  // Ensure we have a NextResponse with proper headers and cookies properties
  const response = ensureNextResponse(intlResponse);

  // Apply privacy controls based on GPC status
  return applyPrivacyControls(request, response, gpcEnabled);
}

export const config = {
  // Match all routes except Next.js internals, API routes, and static files
  matcher: [
    // CMS slugs may contain a dot; they still need locale routing and existence checks.
    '/:locale(en|es)/:section(index|news|careers|about|forms)/:slug*',
    '/:section(index|news|careers|about|forms)/:slug*',
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - images (static images)
     * - Any file with extension (like .jpg, .png, .js, .css, etc.)
     */
    '/((?!api|_next/static|_next/image|favicon.ico|images|.*\\..*).*)',
  ],
};
