// Copyright © Todd Agriscience, Inc. All rights reserved.

/**
 * @fileoverview
 * Stands in for `next/link` under the React Vite builder.
 *
 * The real module pulls in Next's client router helpers, which read `process`
 * at module scope. Vite's preview defines no such global, so merely importing
 * a component that links anywhere throws `ReferenceError: process is not
 * defined` and blanks the story — including via next-intl's `Link`, which
 * wraps this module.
 *
 * Navigation has no meaning inside the preview iframe, so an anchor is the
 * whole of the behavior worth reproducing.
 */

import React from 'react';

/** Next accepts an object href; stories only ever use `pathname` and `query`. */
interface UrlObject {
  pathname?: string;
  query?: Record<string, string | number>;
}

type NextLinkProps = Omit<
  React.AnchorHTMLAttributes<HTMLAnchorElement>,
  'href'
> & {
  href: string | UrlObject;
  /** Next-only props, accepted so stories type-check, then dropped. */
  prefetch?: boolean | null;
  replace?: boolean;
  scroll?: boolean;
  shallow?: boolean;
  passHref?: boolean;
  legacyBehavior?: boolean;
  locale?: string | false;
};

function toHref(href: string | UrlObject): string {
  if (typeof href === 'string') {
    return href;
  }
  const query = new URLSearchParams(
    Object.entries(href.query ?? {}).map(([key, value]) => [key, String(value)])
  ).toString();
  return `${href.pathname ?? ''}${query ? `?${query}` : ''}`;
}

/**
 * Renders a plain anchor in place of Next's client-side link.
 *
 * @param props - `next/link` props; Next-only ones are dropped
 * @returns An `a` element
 */
export default function NextLinkMock({
  href,
  children,
  prefetch: _prefetch,
  replace: _replace,
  scroll: _scroll,
  shallow: _shallow,
  passHref: _passHref,
  legacyBehavior: _legacyBehavior,
  locale: _locale,
  ...rest
}: NextLinkProps) {
  return (
    <a {...rest} href={toHref(href)}>
      {children}
    </a>
  );
}
