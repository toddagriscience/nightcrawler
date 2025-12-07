import { NextRequest, NextResponse } from 'next/server';

export default function applyNonce(request: NextRequest) {
  const nonce = Buffer.from(crypto.randomUUID()).toString('base64');
  const isDev = process.env.NODE_ENV === 'development';

  const cspHeader = `
    default-src 'self';
    script-src 'self' 'nonce-${nonce}' ${isDev ? "'unsafe-eval'" : ''} 'strict-dynamic' https://*.posthog.com https://challenges.cloudflare.com;
    style-src 'self' ${isDev ? "'unsafe-inline'" : `'nonce-${nonce}'`} https://*.posthog.com;
    img-src 'self' blob: data: https://*.posthog.com;
    font-src 'self' https://*.posthog.com;
    media-src 'self' https://*.posthog.com;
    connect-src 'self' https://*.posthog.com https://*.supabase.co;
    object-src 'none';
    frame-src https://challenges.cloudflare.com;
    base-uri 'self';
    form-action 'self';
    frame-ancestors 'none';
    upgrade-insecure-requests;
  `;

  // Replace newline characters and spaces
  const contentSecurityPolicyHeaderValue = cspHeader
    .replace(/\s{2,}/g, ' ')
    .trim();

  const requestHeaders = new Headers(request.headers);
  requestHeaders.set('x-nonce', nonce);

  requestHeaders.set(
    'Content-Security-Policy',
    contentSecurityPolicyHeaderValue
  );

  const response = NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });
  response.headers.set(
    'Content-Security-Policy',
    contentSecurityPolicyHeaderValue
  );

  return response;
}
