// Copyright © Todd Agriscience, Inc. All rights reserved.

/**
 * Returns the right-most non-empty entry of a comma-separated header value.
 *
 * `x-forwarded-for` is append-style: each proxy appends the address it received
 * the connection from. The left-most entry is therefore whatever the *client*
 * sent and is fully attacker-controlled, while the right-most entry is the hop
 * appended by the closest trusted proxy.
 *
 * @param value - Raw header value, possibly a comma-separated list.
 * @returns The right-most non-empty entry, or `null` when there is none.
 */
function lastHop(value: string | null): string | null {
  if (!value) {
    return null;
  }

  const hops = value
    .split(',')
    .map((hop) => hop.trim())
    .filter((hop) => hop.length > 0);

  return hops.length > 0 ? (hops[hops.length - 1] as string) : null;
}

/**
 * Extracts the originating client IP address from request headers.
 *
 * Headers are consulted in descending order of trustworthiness:
 *
 * 1. `x-vercel-forwarded-for` — set by the Vercel edge and stripped from
 *    inbound requests, so it cannot be forged by a client.
 * 2. the right-most hop of `x-forwarded-for` — the entry appended by the
 *    closest proxy. The left-most entry is deliberately ignored: it is
 *    client-supplied, so trusting it would let an attacker mint a fresh
 *    rate-limit bucket on every request simply by rotating the header.
 * 3. `x-real-ip` — single-value fallback set by some proxies.
 *
 * Returns `null` when nothing trustworthy is present. Callers must treat that
 * as "cannot identify this client" rather than substituting a placeholder: a
 * shared placeholder key would collapse every header-less request worldwide
 * into a single rate-limit bucket, which is a self-inflicted denial of service.
 *
 * This value is a rate-limit key for defense-in-depth only. Do not use it for
 * authentication or authorization decisions.
 *
 * @param headerList - Request headers to read from, e.g. `await headers()`.
 * @returns The trimmed client IP, or `null` when none can be trusted.
 */
export function getClientIp(headerList: Headers): string | null {
  return (
    lastHop(headerList.get('x-vercel-forwarded-for')) ??
    lastHop(headerList.get('x-forwarded-for')) ??
    lastHop(headerList.get('x-real-ip'))
  );
}
