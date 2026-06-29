// Copyright © Todd Agriscience, Inc. All rights reserved.

import {
  ArticleIndex,
  type ArticleIndexProps,
} from '@/app/(unauthenticated)/[locale]/(marketing)/components/article-index/article-index';
import {
  NEWS_TOPIC_TYPES,
  type ArticleContentType,
} from '@/lib/sanity/article-types';
import { getNewsIndexArticles } from '@/lib/sanity/articles';
import { getTranslations } from 'next-intl/server';

/**
 * Newsroom listing (`/{locale}/news`) — the news taxonomy rendered with the
 * shared {@link ArticleIndex} template (same look as `/research/index`).
 *
 * Topic tabs use `?topic=` query params instead of path segments because the
 * `/news/[slug]` legacy article route owns the dynamic segment. The active
 * topic comes from `searchParams.topic` (validated against
 * {@link NEWS_TOPIC_TYPES}; unknown → `all`).
 *
 * @param props - Page props
 * @param props.params - Route params (`locale` selects the translation locale)
 * @param props.searchParams - Search params (`count` reveals rows; `topic` filters)
 * @returns {Promise<JSX.Element>} The newsroom listing page
 */
export default async function News({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ count?: string; topic?: string }>;
}) {
  const { locale } = await params;
  const { count, topic } = await searchParams;
  const t = await getTranslations({ locale, namespace: 'articleIndex' });
  const articles = await getNewsIndexArticles();

  const activeTopic: ArticleIndexProps['activeTopic'] =
    topic && (NEWS_TOPIC_TYPES as readonly string[]).includes(topic)
      ? (topic as ArticleContentType)
      : 'all';

  return (
    <ArticleIndex
      articles={articles}
      topics={NEWS_TOPIC_TYPES}
      activeTopic={activeTopic}
      basePath="/news"
      title={t('titles.news')}
      t={t}
      countParam={count}
      topicHrefMode="query"
      showTopicTabs
    />
  );
}
