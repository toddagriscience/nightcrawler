// Copyright © Todd Agriscience, Inc. All rights reserved.

import { env } from '@/lib/env';
import { isSelfReferentialArticleUrl } from '@/lib/sanity/article-urls';
import {
  getArticleBySlug,
  isCareerArticle,
  isInternalArticle,
} from '@/lib/sanity/articles';
import { notFound, permanentRedirect, redirect } from 'next/navigation';

/**
 * `/careers/[slug]` resolves only Sanity articles classified as careers; internal posts 308 to
 * `/index/[slug]`, outbound roles redirect to `offSiteUrl`.
 *
 * @param params - Locale and slug
 */
export default async function LegacyCareersArticleRedirect({
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
      permanentRedirect(`/${locale}/index/${slug}`);
      return;
    }
    redirect(String(article.offSiteUrl));
    return;
  }
  permanentRedirect(`/${locale}/index/${slug}`);
}
