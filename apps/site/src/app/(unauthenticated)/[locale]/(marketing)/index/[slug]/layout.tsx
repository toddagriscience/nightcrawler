// Copyright © Todd Agriscience, Inc. All rights reserved.

import { createMetadata } from '@/lib/metadata';
import { getArticleBySlug, isInternalArticle } from '@/lib/sanity/articles';
import type { Metadata } from 'next';

/**
 * SEO metadata for the canonical CMS article route.
 *
 * @param params - Locale and slug
 */
export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale, slug } = await params;
  const article = await getArticleBySlug(slug, {
    next: { revalidate: 60 * 60 },
  });
  if (article === undefined || article === null) {
    return {};
  }
  if (!isInternalArticle(article)) {
    return {};
  }
  const path = `/${locale}/index/${slug}`;
  const summary = article.summary;
  const description =
    summary !== undefined && summary !== null && summary.length > 0
      ? summary
      : 'Todd Agriscience articles and announcements.';
  return createMetadata({
    title: article.title,
    description,
    path,
  });
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
