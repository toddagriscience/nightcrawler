// Copyright © Todd Agriscience, Inc. All rights reserved.

import { MarketingPillLink } from './marketing-pill-link';

/** Careers-style centered hero (`font-normal`). */
export interface MarketingPageHeroProps {
  /** DOM id for the `<h1>` (labelling / anchors) */
  titleId?: string;
  /** Small label above headline */
  kicker?: string;
  /** Primary `<h1>` */
  title: string;
  /** Supporting paragraph */
  subtitle?: string;
  /** Optional secondary pill (e.g. anchor to values) */
  secondaryCta?: { label: string; href: string };
}

/**
 * Centered marketing page hero with optional outline pill CTA.
 *
 * @param props - Hero copy and optional secondary link
 */
export function MarketingPageHero({
  titleId = 'marketing-page-hero-title',
  kicker,
  title,
  subtitle,
  secondaryCta,
}: MarketingPageHeroProps) {
  return (
    <section
      aria-labelledby={titleId}
      className="flex flex-col items-center px-4 text-center md:px-6"
    >
      {kicker !== undefined && kicker.length > 0 ? (
        <p className="text-sm font-normal tracking-normal text-[#848484]">
          {kicker}
        </p>
      ) : null}
      <h1
        id={titleId}
        className={`max-w-3xl text-4xl font-normal leading-tight tracking-tight text-foreground md:text-5xl md:leading-tight ${kicker !== undefined && kicker.length > 0 ? 'mt-6' : ''}`}
      >
        {title}
      </h1>
      {subtitle !== undefined && subtitle.length > 0 ? (
        <p className="mx-auto mt-6 max-w-xl text-base font-normal leading-relaxed text-foreground md:text-lg">
          {subtitle}
        </p>
      ) : null}
      {secondaryCta !== undefined ? (
        <div className="mt-10">
          <MarketingPillLink href={secondaryCta.href}>
            {secondaryCta.label}
          </MarketingPillLink>
        </div>
      ) : null}
    </section>
  );
}
