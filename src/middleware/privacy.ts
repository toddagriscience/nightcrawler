// Copyright © Todd Agriscience, Inc. All rights reserved.

import { logger } from '@/lib/logger';
import { NextRequest, NextResponse } from 'next/server';

/**
 * Check if Global Privacy Control (GPC) is enabled
 * @param {NextRequest} request - The request object
 * @returns {boolean} - The GPC status
 */
export function hasGPCEnabled(request: NextRequest): boolean {
  const gpcHeader = request.headers.get('Sec-GPC');
  return gpcHeader === '1';
}

/**
 * Apply privacy controls and headers based on GPC status
 * @param {NextRequest} request - The request object
 * @param {NextResponse} response - The response object
 * @param {boolean} gpcEnabled - The GPC status
 * @returns {NextResponse} - The response object
 */
export function applyPrivacyControls(
  request: NextRequest,
  response: NextResponse,
  gpcEnabled: boolean
): NextResponse {
  if (gpcEnabled) {
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
