// Copyright © Todd Agriscience, Inc. All rights reserved.

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
 * Legacy `/news/[slug]` entry point preserved with redirects to `/index/[slug]`, `/careers/[slug]`,
 * or outbound URLs.
 *
 * @param params - Locale and slug
 */
export default async function LegacyNewsArticleRedirect({
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
  const careerPath = getLocalizedPath(locale, `/careers/${slug}`);
  const newsPath = getLocalizedPath(locale, `/index/${slug}`);

  if (!isInternalArticle(article)) {
    if (
      isSelfReferentialArticleUrl(
        String(article.offSiteUrl),
        locale,
        slug,
        env.baseUrl
      )
    ) {
      permanentRedirect(isCareerArticle(article) ? careerPath : newsPath);
      return;
    }
    redirect(String(article.offSiteUrl));
    return;
  }
  permanentRedirect(isCareerArticle(article) ? careerPath : newsPath);
}
