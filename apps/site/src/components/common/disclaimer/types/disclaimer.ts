// Copyright © Todd Agriscience, Inc. All rights reserved.

/**
 * Props for the Disclaimer component
 */
export interface DisclaimerProps {
  /** Translation namespace holding the numbered disclaimers. Ex. `careers.disclaimers` */
  translationLoc: string;
  /** Number of separate disclaimers (paragraphs) under `translationLoc`, keyed `"0"`, `"1"`, ... */
  disclaimerCount: number;
  /**
   * Rich-text link tags available to the disclaimer messages, mapped tag name → href.
   * A message such as `"please <inquiry>contact us</inquiry>"` with
   * `links={{ inquiry: '/contact' }}` renders the wrapped text as a link. Root-relative
   * hrefs become locale-aware internal links; absolute `http(s)` hrefs open in a new tab.
   * Keeps email addresses and raw URLs out of the copy so they cannot be scraped.
   */
  links?: Record<string, string>;
  /** Extra classes merged onto the wrapping `section`. */
  className?: string;
}
