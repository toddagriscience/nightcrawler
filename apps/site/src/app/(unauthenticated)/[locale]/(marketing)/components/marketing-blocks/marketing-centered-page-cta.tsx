// Copyright © Todd Agriscience, Inc. All rights reserved.

import { MarketingPillLink } from './marketing-pill-link';

/** Closing centered headline + pill link */
export interface MarketingCenteredPageCtaProps {
  sectionId?: string;
  headingId?: string;
  heading: string;
  ctaLabel: string;
  ctaHref: string;
}

/**
 * Bottom-of-page marketing CTA stack (matches careers closing band).
 *
 * @param props - Heading and pill destination
 */
export function MarketingCenteredPageCta({
  sectionId,
  headingId,
  heading,
  ctaLabel,
  ctaHref,
}: MarketingCenteredPageCtaProps) {
  const hid = headingId ?? 'marketing-page-footer-cta-heading';

  return (
    <section
      aria-labelledby={hid}
      className="mx-auto max-w-3xl px-4 pb-16 pt-12 text-center md:px-6 md:pb-24 md:pt-16"
      id={sectionId}
    >
      <h2
        id={hid}
        className="text-3xl font-normal leading-tight tracking-tight text-foreground md:text-[34px] md:leading-tight"
      >
        {heading}
      </h2>
      <div className="mt-10 flex justify-center">
        <MarketingPillLink href={ctaHref}>{ctaLabel}</MarketingPillLink>
      </div>
    </section>
  );
}
