// Copyright © Todd Agriscience, Inc. All rights reserved.

/** Parsed pathname and search for a safe internal redirect target. */
export interface SafeRedirectNext {
  /** Path only (e.g. `/incoming`) */
  pathname: string;
  /** Query string including leading `?`, or empty string */
  search: string;
}

/**
 * Parses a validated internal `next` redirect into pathname and search components.
 *
 * @param next - Relative path, optionally with query (e.g. `/incoming?token=abc`)
 * @param origin - Site origin used to parse relative URLs
 */
export function parseSafeRedirectNext(
  next: string,
  origin: string
): SafeRedirectNext {
  const parsed = new URL(next, origin);

  return {
    pathname: parsed.pathname,
    search: parsed.search,
  };
}
