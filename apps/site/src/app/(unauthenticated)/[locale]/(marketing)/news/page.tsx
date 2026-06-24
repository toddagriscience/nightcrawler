// Copyright © Todd Agriscience, Inc. All rights reserved.

import { ArticleIndex } from '@/app/(unauthenticated)/[locale]/(marketing)/components/article-index/article-index';
import { getArticlesByCollection } from '@/lib/sanity/articles';
import { getTranslations } from 'next-intl/server';

/**
 * Newsroom listing (`/{locale}/news`) — the news collection rendered with the
 * shared {@link ArticleIndex} template (same look as `/research/index`).
 *
 * Topic tabs are disabled because the `/news/[slug]` legacy article route owns
 * the dynamic segment, so per-topic paths would collide.
 *
 * @param props - Page props
 * @param props.params - Route params (`locale` selects the translation locale)
 * @param props.searchParams - Search params (`count` reveals additional rows)
 * @returns {Promise<JSX.Element>} The newsroom listing page
 */
export default async function News({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ count?: string }>;
}) {
  const { locale } = await params;
  const { count } = await searchParams;
  const t = await getTranslations({ locale, namespace: 'articleIndex' });
  const articles = await getArticlesByCollection('news');

  return (
    <ArticleIndex
      articles={articles}
      activeTopic="all"
      basePath="/news"
      title={t('titles.news')}
      t={t}
      countParam={count}
      showTopicTabs={false}
    />
  );
}
