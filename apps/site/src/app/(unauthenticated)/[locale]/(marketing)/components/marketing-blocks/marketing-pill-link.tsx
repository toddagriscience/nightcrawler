// Copyright © Todd Agriscience, Inc. All rights reserved.

import { Link } from '@/i18n/config';
import type { ReactNode } from 'react';

/** Tailwind classes shared by outline pill CTAs across marketing surfaces */
export const MARKETING_PILL_LINK_CLASSNAME =
  'inline-flex items-center justify-center rounded-full border border-neutral-400 bg-background px-7 py-2.5 text-base font-normal tracking-tight text-foreground outline-offset-2 transition-colors hover:bg-muted/70 focus-visible:outline focus-visible:outline-2 focus-visible:outline-ring';

/** Props for {@link MarketingPillLink} */
export interface MarketingPillLinkProps {
  /** Destination (`/` routes resolve via next-intl `Link`; use absolute URLs for outbound ATS links) */
  href: string;
  children: ReactNode;
  /** Extra classes merged after {@link MARKETING_PILL_LINK_CLASSNAME} */
  className?: string;
}

/**
 * Locale-aware outline pill link (`next-intl` `Link` internally, `<a>` when external http(s)).
 *
 * @param props - Destination and label
 */
export function MarketingPillLink({
  href,
  children,
  className = '',
}: MarketingPillLinkProps) {
  const combined = `${MARKETING_PILL_LINK_CLASSNAME} ${className}`.trim();
  const external = /^https?:\/\//i.test(href) || href.startsWith('mailto:');

  if (href.startsWith('#')) {
    return (
      <a className={combined} href={href}>
        {children}
      </a>
    );
  }

  if (external) {
    return (
      <a
        className={combined}
        href={href}
        rel="noopener noreferrer"
        target="_blank"
      >
        {children}
      </a>
    );
  }

  return (
    <Link className={combined} href={href}>
      {children}
    </Link>
  );
}
