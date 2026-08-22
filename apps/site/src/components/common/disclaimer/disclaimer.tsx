// Copyright © Todd Agriscience, Inc. All rights reserved.

import { Link } from '@/i18n/config';
import { cn } from '@/lib/utils';
import { logger } from '@/lib/logger';
import { ExternalLink } from 'lucide-react';
import { useTranslations } from 'next-intl';
import type { ReactNode } from 'react';
import type { DisclaimerProps } from './types/disclaimer';

export type { DisclaimerProps } from './types/disclaimer';

const LINK_CLASS_NAME = 'underline font-normal';

/**
 * Renders the text wrapped by a rich-text tag as a link. Internal routes go through the
 * locale-aware next-intl `Link`; absolute `http(s)` URLs open in a new tab, which needs a
 * safe `rel` plus an advance warning that the click leaves the site.
 *
 * The warning is deliberately not part of the accessible name: appending visually hidden
 * text inside the anchor would rewrite the name translators wrote, so sighted users get
 * the conventional arrow glyph (hidden from assistive tech, which would otherwise
 * announce a meaningless icon) and assistive tech gets the same sentence as the link's
 * description via `title`.
 *
 * Anything else — `mailto:`, `javascript:`, a protocol-relative `//host` — renders as
 * plain text rather than an unvetted link. These disclosures are legal copy edited by
 * translators, so a malformed href must not become a navigable target.
 *
 * Tag results need no `key`: next-intl clones every element a tag function returns with
 * one (`prepareTranslationValues` in `use-intl`) before placing it in the chunk array.
 *
 * @param href - Link target from the `links` map
 * @param chunks - Text wrapped by the tag in the message
 * @param newTabLabel - Localized "opens in a new tab" warning for external links
 */
function renderLink(
  href: string,
  chunks: ReactNode,
  newTabLabel: string
): ReactNode {
  if (/^https?:\/\//i.test(href)) {
    return (
      <a
        href={href}
        className={LINK_CLASS_NAME}
        target="_blank"
        rel="noopener noreferrer"
        title={newTabLabel}
      >
        {chunks}
        {/* Inline, never flex: the anchor sits mid-sentence and its text has to
            keep wrapping across lines. Lucide marks an icon `aria-hidden` unless
            it is given an `aria-*`, `role` or `title` prop — do not give it one,
            or the glyph joins the link's accessible name. */}
        <ExternalLink className="ml-1 inline size-3 align-[-0.125em]" />
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
  const tCommon = useTranslations('common');
  const newTabLabel = tCommon('opensInNewTab');

  const richTags = Object.fromEntries(
    Object.entries(links).map(([tag, href]) => [
      tag,
      (chunks: ReactNode) => renderLink(href, chunks, newTabLabel),
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
