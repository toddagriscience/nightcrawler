// Copyright © Todd Agriscience, Inc. All rights reserved.

/** A Todd social media platform. */
export type SocialPlatform = 'x' | 'instagram' | 'linkedin' | 'youtube';

/** URL and accessible label of a single Todd social media profile. */
export interface SocialProfile {
  /** Absolute URL of the Todd profile on this platform. */
  href: string;
  /** Accessible label for a link pointing at this profile. */
  label: string;
}

/**
 * Canonical source of truth for Todd's social media profile URLs and labels.
 *
 * This module is intentionally dependency free (no React, no `react-icons`) so
 * server-only surfaces such as JSON-LD structured data and client components
 * that render a single profile link can import the URLs without pulling the
 * icon set into their bundle. {@link SOCIAL_LINKS} pairs these entries with
 * their icons for rendering.
 */
export const SOCIAL_PROFILES: Record<SocialPlatform, SocialProfile> = {
  x: {
    href: 'https://x.com/toddagriscience',
    label: 'Visit our X (Twitter) page',
  },
  instagram: {
    href: 'https://www.instagram.com/toddagriscience/',
    label: 'Visit our Instagram page',
  },
  linkedin: {
    href: 'https://www.linkedin.com/company/toddagriscience/',
    label: 'Visit our LinkedIn page',
  },
  youtube: {
    href: 'https://www.youtube.com/@toddagriscience',
    label: 'Visit our YouTube channel',
  },
};
