// Copyright © Todd Agriscience, Inc. All rights reserved.

import { connection } from 'next/server';
import { createMetadata } from '@/lib/metadata';
import { getArticleAlternates } from '@/lib/sanity/article-locales';
import { isSelfReferentialArticleUrl } from '@/lib/sanity/article-urls';
import { env } from '@/lib/env';
import type { SanityArticle } from '@/lib/sanity/article-types';
import {
  getArticleBySlug,
  isCareerArticle,
  isInternalArticle,
} from '@/lib/sanity/articles';
import type { Metadata } from 'next';
import type { ReactNode } from 'react';

/**
 * Open Graph / meta `description` for a careers posting: prefers optional `summary` from Sanity when present, else team and location, else a default line.
 *
 * @param article - Internal career-classified document from Sanity
 * @returns Plain-text description for `<meta name="description">`
 */
function careerPostingMetaDescription(article: SanityArticle): string {
  const fromSummary = article.summary?.trim();
  if (fromSummary !== undefined && fromSummary.length > 0) return fromSummary;

  const team =
    article.jobTeam !== undefined && article.jobTeam.trim().length > 0
      ? article.jobTeam.trim()
      : article.company !== undefined && article.company.trim().length > 0
        ? article.company.trim()
        : undefined;
  const loc =
    article.jobLocation !== undefined && article.jobLocation.trim().length > 0
      ? article.jobLocation.trim()
      : undefined;
  const bits = [team, loc].filter((s): s is string => s !== undefined);
  if (bits.length > 0) return bits.join(' — ');

  return 'Todd Agriscience careers.';
}

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
  await connection();
  const { locale, slug } = await params;
  const article = await getArticleBySlug(slug, { cache: 'no-store' }, locale);
  if (article === undefined || article === null) {
    return {};
  }
  if (
    !isCareerArticle(article) ||
    (!isInternalArticle(article) &&
      !isSelfReferentialArticleUrl(
        String(article.offSiteUrl),
        locale,
        slug,
        env.baseUrl
      ))
  ) {
    return {};
  }
  const path = `/${locale}/careers/${slug}`;
  const description = careerPostingMetaDescription(article);
  return {
    ...createMetadata({
      title: article.title,
      description,
      path,
    }),
    alternates: getArticleAlternates(article),
  };
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
