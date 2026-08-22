// Copyright © Todd Agriscience, Inc. All rights reserved.

/**
 * Number of numbered paragraphs under `careers.disclaimers` in the message files.
 */
export const CAREERS_DISCLAIMER_COUNT = 5;

/**
 * Rich-text link tags used by `careers.disclaimers`, mapped tag name → href. The
 * accommodation notice links to the contact inquiry form instead of exposing a mailbox
 * address on the public page; the Transparency in Coverage and Privacy Policy references
 * link to their destinations.
 *
 * Every consumer of `careers.disclaimers` MUST pass this map. The messages carry
 * `<inquiry>`, `<coverage>` and `<privacy>` tags, and next-intl drops the wrapped text
 * for any tag a caller does not supply, so a consumer that omits it silently loses
 * legally required copy.
 */
export const CAREERS_DISCLAIMER_LINKS = {
  inquiry: '/contact',
  coverage: 'https://transparency-in-coverage.collectivehealth.com/index.html',
  privacy: '/privacy',
} as const;
