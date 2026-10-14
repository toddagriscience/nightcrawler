// Copyright © Todd Agriscience, Inc. All rights reserved.

import { NextRequest, NextResponse } from 'next/server';

/**
 * Builds the nonce script policy used for rendering and enforcement.
 * Inline CSS remains available to React and Stripe; executable inline scripts
 * require a matching nonce. Dynamic loaders inherit trust through strict-dynamic.
 */
export function buildNonceCsp(nonce: string, development: boolean): string {
  const imageBase = process.env.NEXT_PUBLIC_SEED_IMAGE_BASE_URL?.trim();
  const imageOrigin = imageBase ? new URL(imageBase).origin : '';
  return [
    "default-src 'self'",
    `script-src 'nonce-${nonce}' 'strict-dynamic'${development ? " 'unsafe-eval'" : ''}`,
    "style-src 'self' 'unsafe-inline' https://*.posthog.com https://js.stripe.com https://m.stripe.network",
    "style-src-elem 'self' 'unsafe-inline' https://*.posthog.com https://js.stripe.com https://m.stripe.network",
    "style-src-attr 'unsafe-inline'",
    `img-src 'self' blob: data: https://*.posthog.com https://cdn.sanity.io https://*.stripe.com ${imageOrigin}`.trim(),
    "font-src 'self' https://*.posthog.com",
    "connect-src 'self' https://*.sanity.io https://*.posthog.com https://*.supabase.co https://api.stripe.com https://r.stripe.com https://checkout.stripe.com",
    "media-src 'self' https://*.posthog.com https://cdn.sanity.io",
    "object-src 'none'",
    "base-uri 'self'",
    "form-action 'self'",
    "frame-ancestors 'self'",
    "frame-src 'self' https://js.stripe.com https://*.js.stripe.com https://hooks.stripe.com https://checkout.stripe.com",
    ...(development ? [] : ['upgrade-insecure-requests']),
  ].join('; ');
}

/**
 * Gives one request a fresh 192-bit nonce and forwards the rendering policy to
 * Next.js. Preserves redirects, rewrites, locale overrides and privacy cookies.
 * The response enforces the same script policy used by the renderer.
 */
export async function withNonceCsp(
  original: NextRequest,
  handle: (request: NextRequest) => Promise<NextResponse>
): Promise<NextResponse> {
  const nonce = Buffer.from(
    crypto.getRandomValues(new Uint8Array(24))
  ).toString('base64');
  const policy = buildNonceCsp(nonce, process.env.NODE_ENV === 'development');
  const headers = new Headers(original.headers);
  headers.set('x-nonce', nonce);
  headers.set('Content-Security-Policy', policy);
  const request = new NextRequest(original, { headers });
  const response = await handle(request);

  // Next-intl already forwards its trusted locale. Fill missing overrides, then
  // replace the two nonce fields so client-supplied headers can never choose them.
  // Authentication may refresh request cookies while handling this request.
  const forwarding = NextResponse.next({
    request: { headers: request.headers },
  });
  const overrideNames = new Set(
    [
      ...(response.headers.get('x-middleware-override-headers')?.split(',') ??
        []),
      ...(forwarding.headers.get('x-middleware-override-headers')?.split(',') ??
        []),
    ]
      .map((name) => name.trim())
      .filter(Boolean)
  );
  for (const [key, value] of forwarding.headers) {
    if (key.startsWith('x-middleware-request-') && !response.headers.has(key)) {
      response.headers.set(key, value);
    }
  }
  response.headers.set('x-middleware-request-x-nonce', nonce);
  response.headers.set('x-middleware-request-content-security-policy', policy);
  response.headers.set(
    'x-middleware-override-headers',
    [...overrideNames].join(',')
  );
  // eslint-disable-next-line drizzle/enforce-delete-with-where -- This removes an HTTP header, not a database row.
  response.headers.delete('Content-Security-Policy-Report-Only');
  response.headers.set('Content-Security-Policy', policy);
  return response;
}
