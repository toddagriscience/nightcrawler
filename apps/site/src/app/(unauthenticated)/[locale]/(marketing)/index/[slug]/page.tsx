// Copyright © Todd Agriscience, Inc. All rights reserved.

import { CmsArticlePage } from '@/app/(unauthenticated)/[locale]/(marketing)/components/cms-article-page/cms-article-page';
import { localizePathname } from '@/i18n/locale-path';
import { env } from '@/lib/env';
import { normalizeContentType } from '@/lib/sanity/article-types';
import { isSelfReferentialArticleUrl } from '@/lib/sanity/article-urls';
import {
  getArticleBySlug,
  isCareerArticle,
  isInternalArticle,
} from '@/lib/sanity/articles';
import { notFound, permanentRedirect, redirect } from 'next/navigation';
import { getTranslations } from 'next-intl/server';

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
  const article = await getArticleBySlug(slug);

  if (article == null) {
    notFound();
    return;
  }

  if (isCareerArticle(article)) {
    permanentRedirect(`/${locale}/careers/${slug}`);
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

  const isResearchArticle = normalizeContentType(
    article.contentType
  ).startsWith('research-');
  const t = await getTranslations({ locale, namespace: 'articleIndex' });
  const backPath = isResearchArticle ? '/research/index' : '/news';

  return (
    <CmsArticlePage
      article={article}
      locale={locale}
      backHref={localizePathname(backPath, locale)}
      backLabel={t(isResearchArticle ? 'backToResearch' : 'backToNews')}
    />
  );
}
