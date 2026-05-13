// Copyright © Todd Agriscience, Inc. All rights reserved.

import { createMetadata } from '@/lib/metadata';
import {
  getArticleBySlug,
  isCareerArticle,
  isInternalArticle,
} from '@/lib/sanity/articles';
import type { Metadata } from 'next';
import type { ReactNode } from 'react';

/**
 * SEO metadata for `/careers/[slug]` Sanity postings.
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
  if (!isCareerArticle(article) || !isInternalArticle(article)) {
    return {};
  }
  const path = `/${locale}/careers/${slug}`;
  const summary = article.summary;
  const description =
    summary !== undefined && summary !== null && summary.length > 0
      ? summary
      : 'Todd Agriscience careers.';
  return createMetadata({
    title: article.title,
    description,
    path,
  });
}

/**
 * Layout wrapper for career posting pages.
 *
 * @param props - Layout children slot
 */
export default function CareersPostingLayout({
  children,
}: {
  children: ReactNode;
}) {
  return children;
}
