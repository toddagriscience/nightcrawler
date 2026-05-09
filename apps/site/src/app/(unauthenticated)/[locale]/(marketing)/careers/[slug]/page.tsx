// Copyright © Todd Agriscience, Inc. All rights reserved.

import { getArticleBySlug, isInternalArticle } from '@/lib/sanity/articles';
import { notFound, permanentRedirect, redirect } from 'next/navigation';

/**
 * Legacy `/careers/[slug]` entry point preserved with redirects to `/index/[slug]` or outbound URLs.
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
  if (!isInternalArticle(article)) {
    redirect(String(article.offSiteUrl));
    return;
  }
  permanentRedirect(`/${locale}/index/${slug}`);
}
