// Copyright © Todd Agriscience, Inc. All rights reserved.

import { CmsArticlePage } from '@/app/(unauthenticated)/[locale]/(marketing)/components/cms-article-page/cms-article-page';
import { env } from '@/lib/env';
import { getLocalizedPath } from '@/lib/canonical-urls';
import { isSelfReferentialArticleUrl } from '@/lib/sanity/article-urls';
import {
  getArticleBySlug,
  getPublishedArticleRouteParams,
  isCareerArticle,
  isInternalArticle,
} from '@/lib/sanity/articles';
import { notFound, permanentRedirect, redirect } from 'next/navigation';

/** Generates routes for published article-language documents only. */
export async function generateStaticParams() {
  return getPublishedArticleRouteParams('news');
}

/**
 * Canonical CMS article page for news and general marketing articles at `/index/[slug]`.
 * Careers postings redirect to `/careers/[slug]`.
 *
 * @param params - Slug for the article
 */
export default async function ArticleIndexPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { slug, locale } = await params;
  const article = await getArticleBySlug(slug, undefined, locale);

  if (article == null) {
    notFound();
    return;
  }

  if (isCareerArticle(article)) {
    permanentRedirect(getLocalizedPath(`/careers/${slug}`, locale));
    return;
  }

  const outbound =
    !isInternalArticle(article) &&
    !isSelfReferentialArticleUrl(
      String(article.offSiteUrl),
      locale,
      slug,
      env.baseUrl
    );

  if (outbound) {
    redirect(article.offSiteUrl as string);
    return;
  }

  return <CmsArticlePage article={article} locale={locale} />;
}
