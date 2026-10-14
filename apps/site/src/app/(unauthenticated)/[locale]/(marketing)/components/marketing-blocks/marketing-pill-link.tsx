// Copyright © Todd Agriscience, Inc. All rights reserved.

import { PAGE_HEADER_BUTTON_CLASSNAME } from '@/components/common/page-header/page-header';
import { Button } from '@/components/ui';
import { Link } from '@/i18n/config';
import { isOutboundHref, toSafeHref } from '@/lib/sanity/safe-href';
import { cn } from '@/lib/utils';
import type { ReactNode } from 'react';

/** Tailwind classes shared by outline pill CTAs across marketing surfaces */
export const MARKETING_PILL_LINK_CLASSNAME = PAGE_HEADER_BUTTON_CLASSNAME;

/** Props for {@link MarketingPillLink} */
export interface MarketingPillLinkProps {
  /** Destination (`/` routes resolve via next-intl `Link`; use absolute URLs for outbound ATS links) */
  href: string;
  children: ReactNode;
  /** Extra classes merged after {@link MARKETING_PILL_LINK_CLASSNAME} */
  className?: string;
}

/**
 * Locale-aware outline pill matching the PageHeader CTA (`Button` outline,
 * `next-intl` `Link` internally, `<a>` when external http(s)).
 *
 * @param props - Destination and label
 */
export function MarketingPillLink({
  href,
  children,
  className = '',
}: MarketingPillLinkProps) {
  const combined = cn(MARKETING_PILL_LINK_CLASSNAME, className);
  const safeHref = toSafeHref(href);

  // Unsafe/empty destination — render the label without a link.
  if (safeHref === null) {
    return (
      <Button asChild variant="outline" className={combined}>
        <span>{children}</span>
      </Button>
    );
  }

  if (safeHref.startsWith('#')) {
    return (
      <Button asChild variant="outline" className={combined}>
        <a href={safeHref}>{children}</a>
      </Button>
    );
  }

  if (isOutboundHref(safeHref)) {
    return (
      <Button asChild variant="outline" className={combined}>
        <a href={safeHref} rel="noopener noreferrer" target="_blank">
          {children}
        </a>
      </Button>
    );
  }

  return (
    <Button asChild variant="outline" className={combined}>
      <Link href={safeHref}>{children}</Link>
    </Button>
  );
}
