// Copyright © Todd Agriscience, Inc. All rights reserved.

import type { CareersLandingCopy } from '../types/careers-landing-copy';

/** Minimal hub payload for structural UI tests */
export const CAREERS_LANDING_VIEW_FIXTURE: CareersLandingCopy = {
  hero: {
    kicker: 'Company',
    title: 'Build the future',
    subtitle: 'Team subtitle.',
    valuesLinkLabel: 'View careers',
    valuesAnchorHref: '/careers/search',
  },
  bridgeStatement: 'Bridge line.',
  valuesBlock: {
    sectionHeading: 'Values:',
    intro: 'Intro values.',
    items: [
      { title: 'One.', body: 'Body.' },
      { title: 'Two.', body: 'Body.' },
      { title: 'Three.', body: 'Body.' },
      { title: 'Four.', body: 'Body.' },
    ],
  },
  operatingPrinciplesBlock: {
    sectionHeading: 'Operating Principles:',
    intro: 'Intro principles.',
    items: [
      { title: 'A.', body: 'Body.' },
      { title: 'B.', body: 'Body.' },
      { title: 'C.', body: 'Body.' },
      { title: 'D.', body: 'Body.' },
    ],
  },
  heroImage: { src: '/marketing/todd-university-header.png', alt: '' },
  benefitsTitle: 'Benefits',
  benefitsSubtitle: 'Subtitle.',
  benefitColumns: [
    { title: 'Col A', bullets: ['One'] },
    { title: 'Col B', bullets: ['Two'] },
    { title: 'Col C', bullets: ['Three'] },
  ],
  splitResidency: {
    heading: 'Residency',
    body: 'Body.',
    ctaLabel: 'Learn more →',
    ctaHref: '/careers/search',
    imageSrc: '/marketing/careers-1.webp',
    imageAlt: '',
  },
  splitEarlyTalent: {
    heading: 'Talent',
    body: 'Body.',
    ctaLabel: 'Learn more →',
    ctaHref: '/careers/search',
    imageSrc: '/marketing/who-we-are-img.jpg',
    imageAlt: '',
  },
  quoteText: 'Quote text.',
  quoteAttribution: 'Author.',
  resourcesEyebrow: 'Resources',
  resourceCards: [
    { title: 'Leadership', category: 'Company' },
    { title: 'Interview guide', category: 'Careers' },
    { title: 'Building dynamic teams', category: 'Company' },
  ],
  footerHeading: 'Footer headline',
  footerCtaLabel: 'View careers →',
  footerCtaHref: '/careers/search',
};
