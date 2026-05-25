// Copyright © Todd Agriscience, Inc. All rights reserved.

import { MarketingSectionHeader } from './marketing-section-header';

/** One benefits column */
export interface MarketingBenefitColumn {
  title: string;
  bullets: readonly string[];
}

/** Benefits band: header + responsive column grid */
export interface MarketingBenefitsColumnsProps {
  sectionId?: string;
  headerId?: string;
  title: string;
  subtitle?: string;
  columns: readonly MarketingBenefitColumn[];
}

/**
 * Three-up (or fewer) benefits lists with shared section header.
 *
 * @param props - Heading and column copy
 */
export function MarketingBenefitsColumns({
  sectionId,
  headerId,
  title,
  subtitle,
  columns,
}: MarketingBenefitsColumnsProps) {
  const hid = headerId ?? 'marketing-benefits-heading';

  return (
    <section
      aria-labelledby={hid}
      className="mx-auto w-full max-w-6xl px-4 md:px-6"
      id={sectionId}
    >
      <MarketingSectionHeader id={hid} subtitle={subtitle} title={title} />
      <div className="mx-auto mt-12 grid max-w-5xl grid-cols-1 gap-12 md:mt-16 md:grid-cols-3 md:gap-8">
        {columns.map((col, index) => (
          <div key={index} className="min-w-0 text-left">
            <h3 className="text-2xl font-[570] leading-snug text-foreground">
              {col.title}
            </h3>
            <ul className="mt-4 list-disc space-y-2 pl-5 text-base font-normal leading-relaxed text-[#444444]">
              {col.bullets.map((line) => (
                <li key={line}>{line}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </section>
  );
}
