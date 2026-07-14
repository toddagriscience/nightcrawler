// Copyright © Todd Agriscience, Inc. All rights reserved.

import logger from '@/lib/logger';
import { revalidatePath } from 'next/cache';
import { NextResponse } from 'next/server';

/**
 * Reads the shared secret that authenticates Sanity webhook calls.
 *
 * @returns {string | undefined} - The configured secret, or undefined when not set
 */
function getRevalidateSecret(): string | undefined {
  return process.env.SANITY_REVALIDATE_SECRET;
}

/**
 * On-demand ISR revalidation endpoint for Sanity content changes.
 *
 * Sanity calls this webhook whenever a document is published, unpublished, or
 * deleted, so content edits appear on the site immediately instead of waiting
 * out the listing revalidation window. The caller must present the shared
 * secret in the `x-revalidate-secret` header. The whole route cache is purged
 * (`revalidatePath('/', 'layout')`) — content changes are infrequent enough
 * that a full purge is simpler and safer than per-path mapping.
 *
 * Setup: create a webhook in sanity.io/manage (dataset `production`, on
 * create/update/delete) pointing at `/api/revalidate` with the header
 * `x-revalidate-secret: $SANITY_REVALIDATE_SECRET`, and set the same value in
 * the Vercel environment.
 *
 * @param {Request} request - The incoming webhook request
 * @returns {Promise<NextResponse>} - JSON result with revalidation status
 */
export async function POST(request: Request): Promise<NextResponse> {
  const secret = getRevalidateSecret();
  if (!secret) {
    logger.error('SANITY_REVALIDATE_SECRET is not configured.');
    return NextResponse.json(
      { error: 'Revalidation is not configured' },
      { status: 503 }
    );
  }

  const provided = request.headers.get('x-revalidate-secret');
  if (provided !== secret) {
    return NextResponse.json({ error: 'Invalid secret' }, { status: 401 });
  }

  let documentType: string | undefined;
  try {
    const body = (await request.json()) as { _type?: string };
    documentType = typeof body._type === 'string' ? body._type : undefined;
  } catch {
    // Body is optional — Sanity payload shape is not required for a full purge.
  }

  revalidatePath('/', 'layout');
  logger.warn('Sanity revalidation triggered', { documentType });

  return NextResponse.json({
    revalidated: true,
    documentType: documentType ?? null,
    now: Date.now(),
  });
}
