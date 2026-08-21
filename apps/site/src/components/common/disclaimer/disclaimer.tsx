// Copyright © Todd Agriscience, Inc. All rights reserved.

import { Link } from '@/i18n/config';
import { cn } from '@/lib/utils';
import { logger } from '@/lib/logger';
import { useTranslations } from 'next-intl';
import type { ReactNode } from 'react';
import type { DisclaimerProps } from './types/disclaimer';

export type { DisclaimerProps } from './types/disclaimer';

const LINK_CLASS_NAME = 'underline font-normal';

/**
 * Renders the text wrapped by a rich-text tag as a link. Internal routes go through the
 * locale-aware next-intl `Link`; absolute `http(s)` URLs open in a new tab with a safe
 * `rel`.
 *
 * Anything else — `mailto:`, `javascript:`, a protocol-relative `//host` — renders as
 * plain text rather than an unvetted link. These disclosures are legal copy edited by
 * translators, so a malformed href must not become a navigable target.
 *
 * @param href - Link target from the `links` map
 * @param chunks - Text wrapped by the tag in the message
 */
function renderLink(href: string, chunks: ReactNode): ReactNode {
  if (/^https?:\/\//i.test(href)) {
    return (
      <a
        href={href}
        className={LINK_CLASS_NAME}
        target="_blank"
        rel="noopener noreferrer"
      >
        {chunks}
      </a>
    );
  }

  // A single leading slash only: `//evil.com` is protocol-relative and leaves the site.
  if (!href.startsWith('/') || href.startsWith('//')) {
    logger.warn('Disclaimer link href is neither a route nor http(s)', {
      href,
    });
    return chunks;
  }

  return (
    <Link href={href} className={LINK_CLASS_NAME}>
      {chunks}
    </Link>
  );
}

/**
 * Disclaimer component. Renders numbered legal disclaimers via next-intl rich text so
 * translators can wrap phrases in link tags declared through `links`. Having to manually
 * add the # of disclaimers to each instance of this component is a pain, but Vitest was
 * having issues with using the `.raw()` function from next-intl, so for sake of time I'm
 * avoiding fixing this.
 *
 * @param {DisclaimerProps} props - Component props
 * @returns {JSX.Element} - The disclaimer component
 * */
export function Disclaimer({
  translationLoc,
  disclaimerCount,
  links = {},
  className,
}: DisclaimerProps) {
  const t = useTranslations(translationLoc);

  const richTags = Object.fromEntries(
    Object.entries(links).map(([tag, href]) => [
      tag,
      (chunks: ReactNode) => renderLink(href, chunks),
    ])
  );

  return (
    <section
      className={cn(
        'mb-32 max-w-[1200px] w-[80vw] mx-auto space-y-1 text-sm leading-relaxed font-light pl-8 indent-[-1rem]',
        className
      )}
    >
      {Array.from({ length: disclaimerCount }).map((_, i) => (
        <p key={i}>
          {i + 1}. {t.rich(String(i), richTags)}
        </p>
      ))}
    </section>
  );
}
