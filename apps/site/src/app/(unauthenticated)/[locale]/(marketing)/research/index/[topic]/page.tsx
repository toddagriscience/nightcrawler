// Copyright © Todd Agriscience, Inc. All rights reserved.

import {
  ARTICLE_INDEX_TOPICS,
  ArticleIndex,
  isArticleIndexTopic,
  topicTabKey,
} from '@/app/(unauthenticated)/[locale]/(marketing)/components/article-index/article-index';
import { getArticlesByCollection } from '@/lib/sanity/articles';
import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import { notFound } from 'next/navigation';

/** Pre-render the known topic routes (`/research/index/research`, …). */
export function generateStaticParams() {
  return ARTICLE_INDEX_TOPICS.map((topic) => ({ topic }));
}

/**
 * Per-topic `<title>` (e.g. "Story · Research"); falls back to nothing for
 * unknown segments (handled by `notFound` in the page).
 *
 * @param props.params - Route params (`locale`, `topic`)
 * @returns {Promise<Metadata>} Topic-specific metadata
 */
export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; topic: string }>;
}): Promise<Metadata> {
  const { locale, topic } = await params;
  if (!isArticleIndexTopic(topic)) return {};
  const t = await getTranslations({ locale, namespace: 'articleIndex' });
  return {
    title: `${t(`tabs.${topicTabKey(topic)}`)} · ${t('titles.research')}`,
    description:
      'Research and product release news from Todd Agriscience, Inc.',
  };
}

/**
 * Topic-filtered research listing (`/{locale}/research/index/[topic]`).
 *
 * Validates the `[topic]` segment against the known content types (unknown →
 * `notFound`), fetches the full `research` set so the tab bar stays complete,
 * and renders the shared {@link ArticleIndex} template scoped to the topic.
 *
 * @param props - Page props
 * @param props.params - Route params (`locale`, `topic`)
 * @param props.searchParams - Search params (`count` reveals additional rows)
 * @returns {Promise<JSX.Element>} The topic listing page
 */
export default async function ResearchTopicPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string; topic: string }>;
  searchParams: Promise<{ count?: string }>;
}) {
  const { locale, topic } = await params;
  const { count } = await searchParams;
  if (!isArticleIndexTopic(topic)) notFound();

  const t = await getTranslations({ locale, namespace: 'articleIndex' });
  const articles = await getArticlesByCollection('research');

  return (
    <ArticleIndex
      articles={articles}
      activeTopic={topic}
      basePath="/research/index"
      title={t('titles.research')}
      t={t}
      countParam={count}
    />
  );
}
