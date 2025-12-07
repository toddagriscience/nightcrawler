import { NextRequest } from 'next/server';

export default function applyNonce(request: NextRequest) {
  const nonce = Buffer.from(crypto.randomUUID()).toString('base64');

  const cspHeader = [
    "default-src 'self'", // Only allow resources from same origin
    `script-src 'self' 'strict-dynamic' 'nonce-${nonce}' https://*.posthog.com https://challenges.cloudflare.com`,
    `style-src 'self' 'nonce-${nonce}' https://*.posthog.com`, // Allow inline styles for CSS-in-JS
    "img-src 'self' blob: data: https://*.posthog.com", // Allow images from self, blob URLs, and data URLs
    "font-src 'self' https://*.posthog.com", // Only allow fonts from same origin - prevents Google Fonts data leaks
    "connect-src 'self' https://*.posthog.com https://*.supabase.co", // Allow PostHog analytics in cookieless mode
    "media-src 'self' https://*.posthog.com", // Restrict media sources
    "object-src 'none'", // Block object/embed/applet
    "base-uri 'self'", // Restrict base tag URLs
    "form-action 'self'", // Restrict form submissions
    "frame-ancestors 'none'", // Prevent embedding in frames
    'frame-src https://challenges.cloudflare.com',
    'upgrade-insecure-requests', // Upgrade HTTP to HTTPS
  ].join('; ');

  // Replace newline characters and spaces
  const contentSecurityPolicyHeaderValue = cspHeader
    .replace(/\s{2,}/g, ' ')
    .trim();

  const newRequestHeaders = new Headers(request.headers);

  // Set the nonce and CSP on the *REQUEST* headers
  newRequestHeaders.set('x-nonce', nonce);
  newRequestHeaders.set(
    'Content-Security-Policy',
    contentSecurityPolicyHeaderValue
  );

  return new NextRequest(request, {
    headers: newRequestHeaders,
  });
}
