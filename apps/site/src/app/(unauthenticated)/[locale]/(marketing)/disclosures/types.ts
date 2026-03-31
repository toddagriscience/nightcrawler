// Copyright © Todd Agriscience, Inc. All rights reserved.

/** A single navigable link with a display label and destination href. */
export type LinkItem = {
  label: string;
  href: string;
};

/** A grouped set of disclosure links divided into primary and sub-links. */
export type LinkSections = {
  primaryLinks: LinkItem[];
  subLinks: LinkItem[];
};
