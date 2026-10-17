// Copyright © Todd Agriscience, Inc. All rights reserved.

import { createArticleMetadata } from '@/lib/sanity/article-presentation';
import { isSelfReferentialArticleUrl } from '@/lib/sanity/article-urls';
import { env } from '@/lib/env';
import { getArticleBySlug, isInternalArticle } from '@/lib/sanity/articles';
import type { Metadata } from 'next';

/**
 * SEO metadata for the canonical CMS article route (`/index/[slug]` or careers canonical path).
 *
 * @param params - Locale and slug
 */
export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale, slug } = await params;
  const article = await getArticleBySlug(slug, undefined, locale);
  if (article === undefined || article === null) {
    return {};
  }
  if (
    !isInternalArticle(article) &&
    !isSelfReferentialArticleUrl(
      String(article.offSiteUrl),
      locale,
      slug,
      env.baseUrl
    )
  ) {
    return {};
  }
  return createArticleMetadata(article);
}

/**
 * Transparent layout wrapper — structure lives in page components.
 *
 * @param props - React children slot
 */
export default function ArticleIndexLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
