// Copyright © Todd Agriscience, Inc. All rights reserved.

/** Fallback identifier used when no client IP can be determined. */
const UNKNOWN_CLIENT_IP = 'unknown';

/**
 * Extracts the originating client IP address from request headers.
 *
 * Reads the `x-forwarded-for` header (set by Vercel / upstream proxies), which
 * may contain a comma-separated list of IPs; the first entry is the original
 * client. Accepts a `Headers` object so callers can pass the result of
 * `await headers()` and so it is trivially unit-testable.
 *
 * Trust note: `x-forwarded-for` is client-supplied and only trustworthy because
 * the hosting proxy (Vercel) sets it. Used here as a rate-limit key for
 * defense-in-depth — not for auth — and the limiter fails open, so a spoofed
 * header cannot deny service to legitimate users. Do not rely on this value for
 * any security-critical decision without a trusted-proxy guarantee.
 *
 * @param headerList - Request headers to read from.
 * @returns The trimmed client IP, or `'unknown'` when unavailable.
 */
export function getClientIp(headerList: Headers): string {
  const forwardedFor = headerList.get('x-forwarded-for');
  if (!forwardedFor) {
    return UNKNOWN_CLIENT_IP;
  }

  const [first] = forwardedFor.split(',');
  const ip = first?.trim();

  return ip ? ip : UNKNOWN_CLIENT_IP;
}
