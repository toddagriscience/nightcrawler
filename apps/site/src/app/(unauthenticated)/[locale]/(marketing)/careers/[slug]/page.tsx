// Copyright © Todd Agriscience, Inc. All rights reserved.

import { headers } from 'next/headers';
import { CareersJobPosting } from '@/app/(unauthenticated)/[locale]/(marketing)/careers/components/careers-job-posting';
import { env } from '@/lib/env';
import { getLocalizedPath } from '@/lib/canonical-urls';
import { isSelfReferentialArticleUrl } from '@/lib/sanity/article-urls';
import {
  getArticleBySlug,
  getPublishedArticleRouteParams,
  isCareerArticle,
  isInternalArticle,
} from '@/lib/sanity/articles';
import { notFound, redirect } from 'next/navigation';

/** Generates routes for published career-language documents only. */
export async function generateStaticParams() {
  return getPublishedArticleRouteParams('career');
}

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
  const nonce = (await headers()).get('x-nonce') ?? undefined;
  const { locale, slug } = await params;
  const article = await getArticleBySlug(slug, { cache: 'no-store' }, locale);
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
      !isSelfReferentialArticleUrl(
        String(article.offSiteUrl),
        locale,
        slug,
        env.baseUrl
      )
    ) {
      redirect(String(article.offSiteUrl));
      return;
    }
  }
  return <CareersJobPosting article={article} locale={locale} nonce={nonce} />;
}
