// Copyright © Todd Agriscience, Inc. All rights reserved.

/** Centered testimonial-style quote */
export interface MarketingQuoteSectionProps {
  sectionId?: string;
  quote: string;
  attribution: string;
}

/**
 * Centered pull-quote with attribution (`font-normal`).
 *
 * @param props - Quote body and credit line
 */
export function MarketingQuoteSection({
  sectionId,
  quote,
  attribution,
}: MarketingQuoteSectionProps) {
  return (
    <section
      className="mx-auto max-w-3xl px-4 py-8 text-center md:px-6 md:py-12"
      id={sectionId}
    >
      <blockquote className="mx-auto border-none">
        <p className="text-2xl font-normal leading-snug text-foreground md:text-[26px] md:leading-snug">
          “{quote}”
        </p>
        <footer className="mt-6 text-sm font-normal text-[#848484] md:text-base">
          {attribution}
        </footer>
      </blockquote>
    </section>
  );
}
