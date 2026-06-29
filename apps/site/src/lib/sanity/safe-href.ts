// Copyright © Todd Agriscience, Inc. All rights reserved.

/** Absolute-URL schemes permitted for CMS-authored links. */
const SAFE_ABSOLUTE_SCHEMES = new Set(['http:', 'https:', 'mailto:', 'tel:']);

/**
 * Sanitizes a CMS-authored href to neutralize XSS via dangerous URL schemes
 * (`javascript:`, `data:`, `vbscript:`, …).
 *
 * Sanity URL fields block non-`http(s)` values in Studio by default, but plain
 * `string` fields (article CTAs, PortableText link marks) do not, and Studio
 * validation is bypassable via the API/import — so any CMS href reaching an
 * `<a>`/`<Link>` must be sanitized at render time.
 *
 * Permitted: in-page fragments (`#…`), root-relative paths (`/index/slug`), and
 * absolute `http(s)`/`mailto`/`tel` URLs. Everything else — including
 * protocol-relative `//host`, scheme-relative junk, and unknown schemes —
 * returns `null` so callers can render the element without a link.
 *
 * @param raw - Raw href value from Sanity (may be `undefined`/`null`)
 * @returns A safe href string, or `null` when the value is unsafe or empty
 */
export function toSafeHref(raw: string | null | undefined): string | null {
  if (raw === null || raw === undefined) return null;
  const trimmed = raw.trim();
  if (trimmed === '') return null;

  // Same-page fragment — always safe.
  if (trimmed.startsWith('#')) return trimmed;

  // Root-relative path, but never protocol-relative (`//host`).
  if (trimmed.startsWith('/')) {
    return trimmed.startsWith('//') ? null : trimmed;
  }

  // Absolute URL with an allow-listed scheme.
  try {
    const url = new URL(trimmed);
    if (SAFE_ABSOLUTE_SCHEMES.has(url.protocol)) {
      return url.href;
    }
  } catch {
    // Not a parseable absolute URL (e.g. a bare relative path) → treat as unsafe.
  }
  return null;
}

/**
 * Whether a {@link toSafeHref}-sanitized href points off-site and should open in
 * a new tab (`http(s)`/`mailto`/`tel`), as opposed to an internal route (`/…`)
 * or fragment (`#…`).
 *
 * @param safeHref - A value already passed through {@link toSafeHref}
 * @returns True for absolute outbound links
 */
export function isOutboundHref(safeHref: string): boolean {
  return /^(https?:|mailto:|tel:)/i.test(safeHref);
}
