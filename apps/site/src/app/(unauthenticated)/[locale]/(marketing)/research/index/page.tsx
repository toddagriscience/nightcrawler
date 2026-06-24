// Copyright © Todd Agriscience, Inc. All rights reserved.

import { ArticleIndex } from '@/app/(unauthenticated)/[locale]/(marketing)/components/article-index/article-index';
import { getArticlesByCollection } from '@/lib/sanity/articles';
import { getTranslations } from 'next-intl/server';

/**
 * Research & product-release listing (`/{locale}/research/index`).
 *
 * Fetches the `research` collection and renders the shared {@link ArticleIndex}
 * template with all topics active. Per-topic views live at
 * `/research/index/[topic]`.
 *
 * @param props - Page props
 * @param props.params - Route params (`locale` selects the translation locale)
 * @param props.searchParams - Search params (`count` reveals additional rows)
 * @returns {Promise<JSX.Element>} The research listing page
 */
export default async function ResearchIndexPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ count?: string }>;
}) {
  const { locale } = await params;
  const { count } = await searchParams;
  const t = await getTranslations({ locale, namespace: 'articleIndex' });
  const articles = await getArticlesByCollection('research');

  return (
    <ArticleIndex
      articles={articles}
      activeTopic="all"
      basePath="/research/index"
      title={t('titles.research')}
      t={t}
      countParam={count}
    />
  );
}
