// Copyright Todd LLC, All rights reserved.

import createMiddleware from 'next-intl/middleware';
import { NextRequest, NextResponse } from 'next/server';
import { routing } from './i18n/config';
import { logger } from '@/lib/logger';

/**
 * Enhanced middleware for internationalization and privacy controls
 * Handles Global Privacy Control (GPC) signals and privacy preferences
 * @returns {Middleware} - The middleware
 */
const intlMiddleware = createMiddleware(routing);

export default function middleware(request: NextRequest) {
  // Check for Global Privacy Control (GPC) signal
  const gpcHeader = request.headers.get('Sec-GPC');
  const hasGPCEnabled = gpcHeader === '1';

  // Run the internationalization middleware first
  const intlResponse = intlMiddleware(request);

  // Ensure we have a NextResponse with proper headers and cookies properties
  const response =
    intlResponse instanceof NextResponse ? intlResponse : NextResponse.next();

  // Copy headers from intl response if it was a basic Response
  if (!(intlResponse instanceof NextResponse)) {
    // Handle case where intl middleware returns a basic Response
    if (
      intlResponse &&
      typeof intlResponse === 'object' &&
      'headers' in intlResponse
    ) {
      const basicResponse = intlResponse as Response;
      if (basicResponse.headers) {
        basicResponse.headers.forEach((value, key) => {
          response.headers.set(key, value);
        });
      }
    }
  }

  // If GPC is enabled, add privacy headers and disable non-essential cookies
  if (hasGPCEnabled) {
    // Add headers to inform downstream components about GPC status
    response.headers.set('x-gpc-detected', '1');
    response.headers.set('x-privacy-mode', 'strict');

    // Remove/prevent non-essential cookies
    const cookiesToRemove = [
      'analytics',
      'tracking',
      'marketing',
      'advertising',
      'social-media',
      'performance',
      'experiments',
      'personalization',
      'recommendations',
      'behavioral',
    ];

    cookiesToRemove.forEach((cookieName) => {
      if (request.cookies.has(cookieName)) {
        response.cookies.delete(cookieName);
        logger.log(`[GPC] Removed non-essential cookie: ${cookieName}`);
      }
    });

    // Log GPC compliance for auditing
    logger.log(
      `[GPC] Privacy signal detected from ${request.headers.get('x-forwarded-for') || 'unknown IP'}. Privacy mode: strict`
    );

    // Add additional privacy headers (Referrer-Policy already set in next.config.ts)
    response.headers.set('X-Privacy-Control', 'gpc-enabled');
    response.headers.set('X-Data-Processing', 'minimal');
  } else {
    // Standard privacy headers for non-GPC users
    response.headers.set('x-privacy-mode', 'standard');
    response.headers.set('X-Privacy-Control', 'standard');
  }

  return response;
}

/**
 * Configuration object for the middleware.
 * Contains the `matcher` property to specify which routes the middleware applies to.
 */

export const config = {
  // Match only internationalized pathnames
  matcher: ['/', '/(en|es)/:path*'],
};
