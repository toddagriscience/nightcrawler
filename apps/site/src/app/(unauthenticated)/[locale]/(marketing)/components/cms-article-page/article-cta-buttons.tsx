// Copyright © Todd Agriscience, Inc. All rights reserved.

import { MarketingPillLink } from '@/app/(unauthenticated)/[locale]/(marketing)/components/marketing-blocks/marketing-pill-link';
import type { SanityArticleCta } from '@/lib/sanity/article-types';
import { cn } from '@/lib/utils';

/** Props for {@link ArticleCtaButtons}. */
export interface ArticleCtaButtonsProps {
  /** Resolved CTA rows to render */
  ctas: SanityArticleCta[];
  /** Optional wrapper classes */
  className?: string;
}

/**
 * Renders one or more marketing pill CTAs for CMS articles.
 *
 * @param props - CTA rows and layout classes
 */
export function ArticleCtaButtons({ ctas, className }: ArticleCtaButtonsProps) {
  if (ctas.length === 0) {
    return null;
  }

  return (
    <div
      className={cn(
        'flex flex-wrap items-center justify-center gap-3',
        className
      )}
    >
      {ctas.map((cta, index) => (
        <MarketingPillLink
          key={cta._key ?? `${cta.href}-${cta.label}-${index}`}
          href={cta.href}
        >
          {cta.label}
        </MarketingPillLink>
      ))}
    </div>
  );
}
