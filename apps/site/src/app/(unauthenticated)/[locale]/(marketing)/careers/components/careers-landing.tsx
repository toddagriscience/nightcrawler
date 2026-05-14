// Copyright © Todd Agriscience, Inc. All rights reserved.

import type { ReactElement } from 'react';

import {
  MarketingBenefitsColumns,
  MarketingBridgeStatement,
  MarketingCenteredPageCta,
  MarketingFullWidthImage,
  MarketingImageTextSplit,
  MarketingPageHero,
  MarketingQuoteSection,
  MarketingResourceCards,
  MarketingValuesOperatingStack,
} from '../../components/marketing-blocks';
import { CAREERS_LANDING_MEDIA } from '../constants/careers-landing-media';
import type { CareersLandingCopy } from '../types/careers-landing-copy';
import { getTranslations } from 'next-intl/server';

export type { CareersLandingCopy } from '../types/careers-landing-copy';

/**
 * Careers hub (`/careers`) composed from reusable marketing blocks (`font-normal` typography).
 *
 * @param props.copy - Resolved hub copy (translations + fixed media paths)
 */
export function CareersLandingView({ copy }: { copy: CareersLandingCopy }) {
  const {
    hero,
    bridgeStatement,
    valuesBlock,
    operatingPrinciplesBlock,
    heroImage,
    benefitsTitle,
    benefitsSubtitle,
    benefitColumns,
    splitResidency,
    splitEarlyTalent,
    quoteText,
    quoteAttribution,
    resourcesEyebrow,
    resourceCards,
    footerHeading,
    footerCtaLabel,
    footerCtaHref,
  } = copy;

  return (
    <main className="text-foreground" id="careers-overview">
      <div className="mx-auto flex max-w-[1100px] flex-col gap-20 px-4 pt-12 md:gap-28 md:px-6 md:pt-16">
        <MarketingPageHero
          kicker={hero.kicker}
          secondaryCta={{
            href: hero.valuesAnchorHref,
            label: hero.valuesLinkLabel,
          }}
          subtitle={hero.subtitle}
          title={hero.title}
          titleId="careers-hub-heading"
        />
        <div className="mt-12 md:mt-20">
          <MarketingBridgeStatement text={bridgeStatement} />
        </div>
        <MarketingValuesOperatingStack
          operatingPrinciples={operatingPrinciplesBlock}
          values={valuesBlock}
        />
      </div>

      <div className="mt-16 md:mt-24">
        <MarketingFullWidthImage
          alt={heroImage.alt}
          aspectClassName="aspect-[16/8.75]"
          imageClassName="object-[center_45%]"
          src={heroImage.src}
        />
      </div>

      <div className="mx-auto flex max-w-[1100px] flex-col gap-20 px-4 pb-16 pt-16 md:gap-28 md:px-6 md:pb-24 md:pt-24">
        <MarketingBenefitsColumns
          columns={benefitColumns}
          headerId="careers-benefits-heading"
          sectionId="careers-benefits"
          subtitle={benefitsSubtitle}
          title={benefitsTitle}
        />

        <MarketingImageTextSplit
          body={splitResidency.body}
          ctaHref={splitResidency.ctaHref}
          ctaLabel={splitResidency.ctaLabel}
          heading={splitResidency.heading}
          headingId="careers-split-residency-heading"
          imageAlt={splitResidency.imageAlt}
          imageHeight={720}
          imageSide="right"
          imageSrc={splitResidency.imageSrc}
          imageWidth={560}
          sectionId="careers-split-residency"
        />

        <MarketingImageTextSplit
          body={splitEarlyTalent.body}
          ctaHref={splitEarlyTalent.ctaHref}
          ctaLabel={splitEarlyTalent.ctaLabel}
          heading={splitEarlyTalent.heading}
          headingId="careers-split-talent-heading"
          imageAlt={splitEarlyTalent.imageAlt}
          imageHeight={720}
          imageSide="left"
          imageSrc={splitEarlyTalent.imageSrc}
          imageWidth={560}
          sectionId="careers-split-early-talent"
        />

        <MarketingQuoteSection
          attribution={quoteAttribution}
          quote={quoteText}
          sectionId="careers-quote"
        />

        <MarketingResourceCards
          cards={resourceCards}
          eyebrow={resourcesEyebrow}
          sectionId="careers-resources"
        />

        <MarketingCenteredPageCta
          ctaHref={footerCtaHref}
          ctaLabel={footerCtaLabel}
          heading={footerHeading}
          headingId="careers-footer-cta-heading"
          sectionId="careers-footer-cta"
        />
      </div>
    </main>
  );
}

/**
 * Turns newline-separated bullet strings from translations into trimmed rows.
 *
 * @param raw - Translator output containing `\n`-delimited lines
 */
function bulletsFromLines(raw: string): string[] {
  return raw
    .split('\n')
    .map((line) => line.trim())
    .filter((line) => line.length > 0);
}

/**
 * Loads `/careers` hub strings for `locale` and renders {@link CareersLandingView}.
 *
 * @param locale - Active `[locale]` segment
 */
export async function CareersLanding({
  locale,
}: {
  locale: string;
}): Promise<ReactElement> {
  const t = await getTranslations({ locale, namespace: 'careers' });

  const copy: CareersLandingCopy = {
    hero: {
      kicker: t('landing.hero.kicker'),
      title: t('landing.hero.title'),
      subtitle: t('landing.hero.subtitle'),
      valuesLinkLabel: t('landing.hero.viewCareersCta'),
      valuesAnchorHref: '/careers/index',
    },
    bridgeStatement: t('landing.bridgeStatement'),
    valuesBlock: {
      sectionHeading: t('landing.values.heading'),
      intro: t('landing.values.intro'),
      items: [
        {
          title: t('landing.values.item1Title'),
          body: t('landing.values.item1Body'),
        },
        {
          title: t('landing.values.item2Title'),
          body: t('landing.values.item2Body'),
        },
        {
          title: t('landing.values.item3Title'),
          body: t('landing.values.item3Body'),
        },
        {
          title: t('landing.values.item4Title'),
          body: t('landing.values.item4Body'),
        },
      ],
    },
    operatingPrinciplesBlock: {
      sectionHeading: t('landing.operatingPrinciples.heading'),
      intro: t('landing.operatingPrinciples.intro'),
      items: [
        {
          title: t('landing.operatingPrinciples.item1Title'),
          body: t('landing.operatingPrinciples.item1Body'),
        },
        {
          title: t('landing.operatingPrinciples.item2Title'),
          body: t('landing.operatingPrinciples.item2Body'),
        },
        {
          title: t('landing.operatingPrinciples.item3Title'),
          body: t('landing.operatingPrinciples.item3Body'),
        },
        {
          title: t('landing.operatingPrinciples.item4Title'),
          body: t('landing.operatingPrinciples.item4Body'),
        },
      ],
    },
    heroImage: {
      src: CAREERS_LANDING_MEDIA.heroWide,
      alt: t('landing.heroImageAlt'),
    },
    benefitsTitle: t('landing.benefits.title'),
    benefitsSubtitle: t('landing.benefits.subtitle'),
    benefitColumns: [
      {
        title: t('landing.benefits.employeesTitle'),
        bullets: bulletsFromLines(t('landing.benefits.employeesBullets')),
      },
      {
        title: t('landing.benefits.lifeTitle'),
        bullets: bulletsFromLines(t('landing.benefits.lifeBullets')),
      },
      {
        title: t('landing.benefits.cultureTitle'),
        bullets: bulletsFromLines(t('landing.benefits.cultureBullets')),
      },
    ],
    splitResidency: {
      heading: t('landing.splits.residency.heading'),
      body: t('landing.splits.residency.body'),
      ctaLabel: t('landing.splits.residency.cta'),
      ctaHref: t('landing.splits.residency.ctaHref'),
      imageSrc: CAREERS_LANDING_MEDIA.splitResidency,
      imageAlt: t('landing.splits.residency.imageAlt'),
    },
    splitEarlyTalent: {
      heading: t('landing.splits.talent.heading'),
      body: t('landing.splits.talent.body'),
      ctaLabel: t('landing.splits.talent.cta'),
      ctaHref: t('landing.splits.talent.ctaHref'),
      imageSrc: CAREERS_LANDING_MEDIA.splitEarlyTalent,
      imageAlt: t('landing.splits.talent.imageAlt'),
    },
    quoteText: t('landing.quote.text'),
    quoteAttribution: t('landing.quote.attribution'),
    resourcesEyebrow: t('landing.resources.eyebrow'),
    resourceCards: [
      {
        title: t('landing.resources.card1Title'),
        category: t('landing.resources.card1Category'),
      },
      {
        title: t('landing.resources.card2Title'),
        category: t('landing.resources.card2Category'),
      },
      {
        title: t('landing.resources.card3Title'),
        category: t('landing.resources.card3Category'),
      },
    ],
    footerHeading: t('landing.footerCta.heading'),
    footerCtaLabel: t('landing.footerCta.cta'),
    footerCtaHref: t('landing.footerCta.ctaHref'),
  };

  return <CareersLandingView copy={copy} />;
}
