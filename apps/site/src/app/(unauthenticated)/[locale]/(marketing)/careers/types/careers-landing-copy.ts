// Copyright © Todd Agriscience, Inc. All rights reserved.

import type {
  MarketingBenefitColumn,
  MarketingResourceCard,
  MarketingValueOperatingBlockCopy,
} from '../../components/marketing-blocks';

/** Hero band copy */
export interface CareersLandingHeroCopy {
  /** Eyebrow above the headline */
  kicker: string;
  /** `<h1>` text */
  title: string;
  /** Supporting paragraph */
  subtitle: string;
  /** Outline pill label (e.g. “View careers” → listings) */
  valuesLinkLabel: string;
  /** Pill destination (`/careers/index`, etc.) */
  valuesAnchorHref: string;
}

/** Full `/careers` marketing hub payload assembled from translations */
export interface CareersLandingCopy {
  hero: CareersLandingHeroCopy;
  /** Centered line between hero and values (team positioning statement) */
  bridgeStatement: string;
  /** “Values:” block with intro + bullets */
  valuesBlock: MarketingValueOperatingBlockCopy;
  /** “Operating principles:” block with intro + bullets */
  operatingPrinciplesBlock: MarketingValueOperatingBlockCopy;
  /** Wide hero photograph below values */
  heroImage: { src: string; alt: string };
  benefitsTitle: string;
  benefitsSubtitle: string;
  benefitColumns: readonly MarketingBenefitColumn[];
  splitResidency: {
    heading: string;
    body: string;
    ctaLabel: string;
    ctaHref: string;
    imageSrc: string;
    imageAlt: string;
  };
  splitEarlyTalent: {
    heading: string;
    body: string;
    ctaLabel: string;
    ctaHref: string;
    imageSrc: string;
    imageAlt: string;
  };
  quoteText: string;
  quoteAttribution: string;
  /** Label above the resource cards grid */
  resourcesEyebrow: string;
  resourceCards: readonly MarketingResourceCard[];
  footerHeading: string;
  footerCtaLabel: string;
  footerCtaHref: string;
}
