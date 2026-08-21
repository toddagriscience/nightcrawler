// Copyright © Todd Agriscience, Inc. All rights reserved.

/**
 * Resolves the originating client IP for use as a rate-limit key.
 *
 * Prefers `x-vercel-forwarded-for`, which the Vercel edge sets and a client
 * cannot write. Falls back to the **right-most** entry of `x-forwarded-for`,
 * then `x-real-ip`.
 *
 * The right-most entry matters. `x-forwarded-for` is append-style: each proxy
 * adds the address it received the connection from, so the left-most element is
 * whatever the *client* sent. Keying on it lets an attacker rotate
 * `x-forwarded-for: <random>` and get a fresh bucket every request, which makes
 * the limiter a no-op. The right-most entry is the one our own proxy appended.
 *
 * Returns `null` rather than a sentinel string when nothing trustworthy is
 * available. A shared constant would put every header-less request worldwide
 * into one bucket, making the limit N requests per minute *in total* — a
 * self-inflicted denial of service rather than a defence. Callers skip the
 * limiter instead; on Vercel these headers are always present, so this path is
 * effectively unreachable in production.
 *
 * Still not an authentication signal — defence in depth for public write
 * endpoints only.
 *
 * @param headerList - Request headers to read from
 * @returns The client IP, or `null` when none can be trusted
 */
export function getClientIp(headerList: Headers): string | null {
  const vercelForwardedFor = headerList.get('x-vercel-forwarded-for')?.trim();
  if (vercelForwardedFor) {
    return vercelForwardedFor;
  }

  const forwardedFor = headerList.get('x-forwarded-for');
  if (forwardedFor) {
    const hops = forwardedFor
      .split(',')
      .map((hop) => hop.trim())
      .filter(Boolean);
    const nearest = hops[hops.length - 1];
    if (nearest) {
      return nearest;
    }
  }

  return headerList.get('x-real-ip')?.trim() || null;
}
