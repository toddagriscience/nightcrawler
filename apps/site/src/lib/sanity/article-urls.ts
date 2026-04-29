// Copyright © Todd Agriscience, Inc. All rights reserved.

/**
 * Builds the locale-relative path for an on-site CMS article (`/index/[slug]`).
 *
 * @param slug - Article slug `current`
 * @returns Path without locale prefix (`next-intl` adds locale)
 */
export function getInternalArticlePath(slug: string): string {
  return `/index/${slug}`;
}

/**
 * Destination for listing cards: external URL when set, otherwise the internal article path.
 *
 * @param article - Article-shaped object (`slug.current` required)
 * @returns Absolute external URL or internal path for `Link`
 */
export function getArticleCardHref(article: {
  offSiteUrl?: string | null;
  slug: { current: string };
}): string {
  const external = article.offSiteUrl;
  if (
    external !== undefined &&
    external !== null &&
    String(external).trim() !== ''
  ) {
    return external;
  }
  return getInternalArticlePath(article.slug.current);
}
