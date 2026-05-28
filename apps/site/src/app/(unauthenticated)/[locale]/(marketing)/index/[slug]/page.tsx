// Copyright © Todd Agriscience, Inc. All rights reserved.

import { CmsArticlePage } from '@/app/(unauthenticated)/[locale]/(marketing)/components/cms-article-page/cms-article-page';
import { env } from '@/lib/env';
import { getLocalizedPath } from '@/lib/locale-utils';
import { isSelfReferentialArticleUrl } from '@/lib/sanity/article-urls';
import {
  getArticleBySlug,
  isCareerArticle,
  isInternalArticle,
} from '@/lib/sanity/articles';
import { notFound, permanentRedirect, redirect } from 'next/navigation';

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
  const article = await getArticleBySlug(slug, {
    next: { revalidate: 60 * 60 },
  });

  if (article == null) {
    notFound();
    return;
  }

  if (isCareerArticle(article)) {
    permanentRedirect(getLocalizedPath(locale, `/careers/${slug}`));
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

  return <CmsArticlePage article={article} />;
}
