// Copyright © Todd Agriscience, Inc. All rights reserved.

/**
 * Footer link interface
 * @property {string} href - The URL of the link
 * @property {string} label - The text of the link
 * @property {boolean} external - Whether the link is external
 * @property {string} testId - The test ID of the link
 */
export interface FooterLink {
  href: string;
  label: string;
  external?: boolean;
  testId?: string;
}

/**
 * Footer section interface
 * @property {string} title - The title of the section
 * @property {string} testId - The test ID of the section
 * @property {FooterLink[]} links - The links in the section
 */
export interface FooterSection {
  title: string;
  testId: string;
  links: FooterLink[];
}
