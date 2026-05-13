// Copyright © Todd Agriscience, Inc. All rights reserved.

import { CmsArticlePage } from '@/app/(unauthenticated)/[locale]/(marketing)/components/cms-article-page/cms-article-page';
import { env } from '@/lib/env';
import { isSelfReferentialArticleUrl } from '@/lib/sanity/article-urls';
import {
  getArticleBySlug,
  isCareerArticle,
  isInternalArticle,
} from '@/lib/sanity/articles';
import { notFound, permanentRedirect, redirect } from 'next/navigation';

/**
 * Canonical on-site careers posting at `/careers/[slug]` (Sanity career-tagged docs).
 *
 * @param params - Locale and slug
 */
export default async function CareersPostingPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  const article = await getArticleBySlug(slug, {
    next: { revalidate: 60 * 60 },
  });
  if (article === undefined || article === null) {
    notFound();
    return;
  }
  if (!isCareerArticle(article)) {
    notFound();
    return;
  }
  if (!isInternalArticle(article)) {
    if (
      isSelfReferentialArticleUrl(
        String(article.offSiteUrl),
        locale,
        slug,
        env.baseUrl
      )
    ) {
      permanentRedirect(`/${locale}/careers/${slug}`);
      return;
    }
    redirect(String(article.offSiteUrl));
    return;
  }
  return <CmsArticlePage article={article} />;
}
