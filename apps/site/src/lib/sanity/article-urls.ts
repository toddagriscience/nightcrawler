// Copyright © Todd Agriscience, Inc. All rights reserved.

import type { SanityArticle } from '@/lib/sanity/article-types';
import { getCanonicalUrl, getLocalizedPath } from '@/lib/canonical-urls';
import { env } from '@/lib/env';
import { toSafeHref } from '@/lib/sanity/safe-href';

import { getArticleBySlug, isCareerArticle } from '@/lib/sanity/articles';

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
  } & Pick<SanityArticle, '_type' | 'language'>
): string {
  const external = article.offSiteUrl;
  if (
    external !== undefined &&
    external !== null &&
    String(external).trim() !== '' &&
    !isSelfReferentialArticleUrl(
      String(external),
      article.language ?? 'en',
      article.slug.current,
      env.baseUrl
    )
  ) {
    return external;
  }
  if (isCareerArticle(article)) {
    return getLocalizedPath(
      getInternalCareerArticlePath(article.slug.current),
      article.language ?? 'en'
    );
  }
  return getLocalizedPath(
    getInternalArticlePath(article.slug.current),
    article.language ?? 'en'
  );
}

/** Resolves a fixed article navigation link to a published translation, with final English fallback. */
export async function getArticleNavigationUrl(
  slug: string,
  locale: string
): Promise<string> {
  const article = await getArticleBySlug(slug);
  const variant = article?.publishedTranslations?.find(
    (translation) => translation.language === locale
  );
  const publication = variant ?? article;
  const href = publication ? toSafeHref(getArticleCardHref(publication)) : null;
  if (href && /^https?:/.test(href)) return href;
  return getCanonicalUrl(
    href ?? getInternalArticlePath(slug),
    publication?.language ?? 'en'
  );
}
