// Copyright © Todd Agriscience, Inc. All rights reserved.

import type { SanityArticle } from '@/lib/sanity/article-types';

import { isCareerArticle } from '@/lib/sanity/articles';

/** Normalizes hostnames so `www.example.com` matches `example.com`. */
function hostnameWithoutWww(host: string): string {
  return host.replace(/^www\./i, '');
}

/**
 * Whether two absolute URLs refer to the same site (scheme + host, ignoring `www.`).
 *
 * @param a - First URL string
 * @param b - Second URL string
 */
function sameRegisteredHostname(a: string, b: string): boolean {
  try {
    const ua = new URL(a);
    const ub = new URL(b);
    return hostnameWithoutWww(ua.hostname) === hostnameWithoutWww(ub.hostname);
  } catch {
    return false;
  }
}

/**
 * Detects CMS `offSiteUrl` values that point back to this article’s own marketing URLs.
 * Those would otherwise cause infinite redirects between `/index/[slug]`, `/news/[slug]`,
 * and `/careers/[slug]` legacy handlers.
 *
 * @param offSiteUrl - Raw value from Sanity (absolute or site-relative)
 * @param locale - Active locale segment (`en`, `es`, …)
 * @param slug - Article `slug.current`
 * @param baseUrl - Site base URL (e.g. `https://toddagriscience.com`)
 * @returns True when the URL targets this document on-site and should not be used as an external redirect
 */
export function isSelfReferentialArticleUrl(
  offSiteUrl: string,
  locale: string,
  slug: string,
  baseUrl: string
): boolean {
  const trimmed = String(offSiteUrl).trim();
  if (trimmed === '') return false;
  try {
    const site = new URL(baseUrl);
    const target = new URL(trimmed, baseUrl);
    if (!sameRegisteredHostname(target.href, site.href)) return false;
    const normalized = target.pathname.replace(/\/+$/, '') || '/';
    const paths = [
      `/${locale}/index/${slug}`,
      `/${locale}/careers/${slug}`,
      `/${locale}/news/${slug}`,
      `/index/${slug}`,
      `/careers/${slug}`,
      `/news/${slug}`,
    ].map((p) => p.replace(/\/+$/, '') || '/');
    return paths.includes(normalized);
  } catch {
    return false;
  }
}

/**
 * Builds the locale-relative path for an on-site non-careers CMS article (`/index/[slug]`).
 *
 * @param slug - Article slug `current`
 * @returns Path without locale prefix (`next-intl` adds locale)
 */
export function getInternalArticlePath(slug: string): string {
  return `/index/${slug}`;
}

/**
 * Builds the locale-relative path for an on-site careers posting (`/careers/[slug]`).
 *
 * @param slug - Article slug `current`
 * @returns Path without locale prefix (`next-intl` adds locale)
 */
export function getInternalCareerArticlePath(slug: string): string {
  return `/careers/${slug}`;
}

/**
 * Destination for listing cards: external URL when set, otherwise the internal article path
 * (`/careers/[slug]` for careers documents, `/index/[slug]` for news and other collections).
 *
 * @param article - Article-shaped object (`slug.current` required)
 * @returns Absolute external URL or internal path for `Link`
 */
export function getArticleCardHref(
  article: {
    offSiteUrl?: string | null;
    slug: { current: string };
  } & Pick<SanityArticle, '_type' | 'contentType' | 'collections'>
): string {
  const external = article.offSiteUrl;
  if (
    external !== undefined &&
    external !== null &&
    String(external).trim() !== ''
  ) {
    return external;
  }
  if (isCareerArticle(article)) {
    return getInternalCareerArticlePath(article.slug.current);
  }
  return getInternalArticlePath(article.slug.current);
}
