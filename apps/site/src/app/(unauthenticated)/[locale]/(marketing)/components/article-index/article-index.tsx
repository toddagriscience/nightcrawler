// Copyright © Todd Agriscience, Inc. All rights reserved.

import { Link } from '@/i18n/config';
import { formatArticleListDate } from '@/lib/sanity/article-display-dates';
import {
  ARTICLE_INDEX_TOPIC_TYPES,
  normalizeContentType,
  type ArticleContentType,
  type SanityArticle,
} from '@/lib/sanity/article-types';
import { getArticleCardHref } from '@/lib/sanity/article-urls';
import { isOutboundHref, toSafeHref } from '@/lib/sanity/safe-href';
import { BiChevronDown } from 'react-icons/bi';
import { LuLayoutGrid, LuMenu } from 'react-icons/lu';

/** Minimal `next-intl` translator shape used by {@link ArticleIndex}. */
export type ArticleIndexTranslate = (
  key: string,
  values?: Record<string, string | number>
) => string;

/** How an active topic is encoded in tab/"View more" links. */
export type ArticleIndexTopicHrefMode = 'path' | 'query';

/** How many rows are visible initially and revealed per "View more" click. */
const PAGE_SIZE = 9;

/**
 * Research-index topic content types, in render order. Alias of
 * {@link ARTICLE_INDEX_TOPIC_TYPES} so the research routes and the tab/route
 * list never drift; the news index passes {@link NEWS_TOPIC_TYPES} instead.
 */
export const ARTICLE_INDEX_TOPICS: readonly ArticleContentType[] =
  ARTICLE_INDEX_TOPIC_TYPES;

/** Maps a namespaced `contentType` to its `articleIndex.tabs.*` translation key. */
const CONTENT_TYPE_TAB_KEY: Record<ArticleContentType, string> = {
  'research-publication': 'researchPublication',
  'research-conclusion': 'researchConclusion',
  'research-milestone': 'researchMilestone',
  'research-release': 'researchRelease',
  'news-publication': 'newsPublication',
  'news-milestone': 'newsMilestone',
  'news-release': 'newsRelease',
  'news-company': 'newsCompany',
  'news-research': 'newsResearch',
  'news-global-affairs': 'newsGlobalAffairs',
};

/**
 * Type guard for a `/research/index/[topic]` segment: true when `value` is a
 * valid research topic content type ({@link ARTICLE_INDEX_TOPIC_TYPES}).
 *
 * @param value - Raw route segment
 * @returns Whether `value` is a renderable research topic
 */
export function isArticleIndexTopic(
  value: string
): value is ArticleContentType {
  return (ARTICLE_INDEX_TOPICS as readonly string[]).includes(value);
}

/**
 * The `articleIndex.tabs.*` translation key for a content type — exported so
 * routes can label topic metadata without duplicating the map.
 *
 * @param type - Article content type
 * @returns The translation key under `articleIndex.tabs`
 */
export function topicTabKey(type: ArticleContentType): string {
  return CONTENT_TYPE_TAB_KEY[type];
}

/** An article's effective content type, with legacy values normalized. */
function contentTypeOf(article: SanityArticle): ArticleContentType {
  return normalizeContentType(article.contentType);
}

/**
 * Listing summary to display, or `null` when blank or a placeholder (`n/a`).
 * Editors sometimes set `n/a` on link-only rows; those should show no subtitle.
 *
 * @param summary - Raw `summary` field from Sanity
 * @returns Trimmed summary, or `null` when nothing meaningful to show
 */
function displaySummary(summary: string | undefined): string | null {
  const trimmed = summary?.trim();
  if (!trimmed || trimmed.toLowerCase() === 'n/a') return null;
  return trimmed;
}

/** Props for {@link ArticleIndex}. */
export interface ArticleIndexProps {
  /** Full collection set; topic tabs are derived from this so the bar is stable across topic pages. */
  articles: SanityArticle[];
  /** Topic content types this surface offers as tabs (e.g. research vs news taxonomy), in render order. */
  topics: readonly ArticleContentType[];
  /** Active topic, or `'all'`. Supplied by the route (param, search param, or default). */
  activeTopic: ArticleContentType | 'all';
  /** Locale-relative base for tab and "View more" links (e.g. `/research/index`, `/news`). */
  basePath: string;
  /** Page heading (already localized). */
  title: string;
  /** `next-intl` translator bound to the `articleIndex` namespace. */
  t: ArticleIndexTranslate;
  /** Raw `?count=` value driving how many rows are revealed. */
  countParam?: string;
  /** Render the topic tab bar. Disable on surfaces whose dynamic segment is taken (e.g. `/news/[slug]`). */
  showTopicTabs?: boolean;
  /**
   * How the active topic is encoded: `'path'` uses `${basePath}/${type}`
   * segments (research routes); `'query'` uses `${basePath}?topic=${type}`
   * (news, whose dynamic segment is owned by `/news/[slug]`). Defaults to `'path'`.
   */
  topicHrefMode?: ArticleIndexTopicHrefMode;
}

/**
 * OpenAI-style article listing template shared by `/research/index`,
 * `/research/index/[topic]`, and `/news`.
 *
 * Server-renders a heading, an optional content-type tab bar, a Filter/Sort/
 * grid-list toolbar, and a divided list of rows that link to each article's
 * detail route. Tabs are derived from the `topics` prop (research vs news
 * taxonomy) and encoded per `topicHrefMode` — `'path'` segments for the research
 * routes or `?topic=` query params for `/news` (whose dynamic segment is owned
 * by `/news/[slug]`). The active topic and revealed count are driven by the
 * route so filtering and pagination stay server-rendered and shareable. All
 * CMS-authored hrefs are sanitized with {@link toSafeHref} so dangerous schemes
 * never reach an anchor.
 *
 * @param props - {@link ArticleIndexProps}
 * @returns {JSX.Element} The listing page body
 */
export function ArticleIndex({
  articles,
  topics,
  activeTopic,
  basePath,
  title,
  t,
  countParam,
  showTopicTabs = true,
  topicHrefMode = 'path',
}: ArticleIndexProps) {
  // Tabs: 'all' + each offered topic present in the full set (fixed order).
  const presentTypes = topics.filter((type) =>
    articles.some((article) => contentTypeOf(article) === type)
  );

  const filteredItems =
    activeTopic === 'all'
      ? articles
      : articles.filter((article) => contentTypeOf(article) === activeTopic);

  const requestedCount = Number.parseInt(countParam ?? '', 10);
  const visibleCount = Math.min(
    Number.isFinite(requestedCount) && requestedCount > 0
      ? Math.max(requestedCount, PAGE_SIZE)
      : PAGE_SIZE,
    filteredItems.length
  );
  const visibleItems = filteredItems.slice(0, visibleCount);
  const hasMore = visibleCount < filteredItems.length;
  const nextCount = Math.min(visibleCount + PAGE_SIZE, filteredItems.length);

  /** Link for a tab ('all' → base; otherwise path segment or `?topic=` per mode). */
  const topicHref = (topic: ArticleContentType | 'all'): string => {
    if (topic === 'all') return basePath;
    return topicHrefMode === 'query'
      ? `${basePath}?topic=${topic}`
      : `${basePath}/${topic}`;
  };

  // "View more" preserves the active topic alongside the revealed count.
  let viewMoreHref: string;
  if (topicHrefMode === 'query') {
    viewMoreHref =
      activeTopic === 'all'
        ? `${basePath}?count=${nextCount}`
        : `${basePath}?topic=${activeTopic}&count=${nextCount}`;
  } else {
    const topicSegment = activeTopic === 'all' ? '' : `/${activeTopic}`;
    viewMoreHref = `${basePath}${topicSegment}?count=${nextCount}`;
  }

  const tabs: Array<{ key: string; href: string; label: string }> = [
    { key: 'all', href: topicHref('all'), label: t('tabs.all') },
    ...presentTypes.map((type) => ({
      key: type,
      href: topicHref(type),
      label: t(`tabs.${CONTENT_TYPE_TAB_KEY[type]}`),
    })),
  ];

  return (
    <main className="bg-white text-black">
      <div className="mx-auto w-full max-w-[1440px] px-6 pb-24 pt-12 sm:px-12 md:pt-16 lg:px-20">
        {/* Heading + toolbar */}
        <header className="flex flex-col gap-8 lg:gap-10">
          <h1 className="text-[40px] font-normal leading-tight sm:text-[48px] sm:leading-[64px]">
            {title}
          </h1>

          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            {showTopicTabs ? (
              <nav aria-label={t('controls.filterNav')}>
                <ul className="flex flex-wrap items-center gap-x-6 gap-y-2">
                  {tabs.map((tab) => (
                    <li key={tab.key}>
                      <Link
                        href={tab.href}
                        aria-current={
                          tab.key === activeTopic ? 'true' : undefined
                        }
                        className="text-[18px] font-normal leading-7 text-black transition-opacity hover:opacity-60 aria-[current=true]:underline aria-[current=true]:underline-offset-4"
                      >
                        {tab.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </nav>
            ) : (
              <span />
            )}

            <div className="flex items-center gap-6 text-[14px] leading-7">
              <button
                type="button"
                className="flex items-center gap-1 text-black transition-opacity hover:opacity-60"
              >
                {t('controls.filter')}
                <BiChevronDown aria-hidden className="size-4" />
              </button>
              <button
                type="button"
                className="flex items-center gap-1 text-black transition-opacity hover:opacity-60"
              >
                {t('controls.sort')}
                <BiChevronDown aria-hidden className="size-4" />
              </button>

              {/* Grid / list view toggle */}
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  aria-label={t('controls.gridView')}
                  className="text-[#d9d9d9] transition-opacity hover:opacity-60"
                >
                  <LuLayoutGrid aria-hidden className="size-[18px]" />
                </button>
                <button
                  type="button"
                  aria-label={t('controls.listView')}
                  aria-pressed
                  className="text-[#181818] transition-opacity hover:opacity-60"
                >
                  <LuMenu aria-hidden className="size-[18px]" />
                </button>
              </div>
            </div>
          </div>
        </header>

        {/* Listing */}
        {filteredItems.length === 0 ? (
          <p className="mt-12 text-[14px] leading-7 text-[#666666]">
            {activeTopic === 'all'
              ? t('emptyAll')
              : t('empty', {
                  category: t(
                    `tabs.${CONTENT_TYPE_TAB_KEY[activeTopic]}`
                  ).toLowerCase(),
                })}
          </p>
        ) : (
          <ul className="mt-8">
            {visibleItems.map((article) => {
              const safeHref = toSafeHref(getArticleCardHref(article));
              const summary = displaySummary(article.summary);
              const rowInner = (
                <div className="flex flex-col gap-2 py-7 transition-opacity hover:opacity-70 md:flex-row md:gap-10">
                  <div className="flex gap-3 text-[14px] leading-7 md:w-[280px] md:shrink-0 md:flex-col md:gap-0">
                    <span className="text-black">
                      {t(
                        `tabs.${CONTENT_TYPE_TAB_KEY[contentTypeOf(article)]}`
                      )}
                    </span>
                    <span className="text-[#666666]">
                      {formatArticleListDate(article.date)}
                    </span>
                  </div>

                  <div className="max-w-[600px]">
                    <h2 className="text-[18px] font-normal leading-[26px] text-black">
                      {article.title}
                    </h2>
                    {summary ? (
                      <p className="mt-2 text-[14px] font-normal leading-[27px] text-black">
                        {summary}
                      </p>
                    ) : null}
                  </div>
                </div>
              );

              let row;
              if (safeHref === null) {
                // No safe destination — render the row content without a link.
                row = <div className="block">{rowInner}</div>;
              } else if (isOutboundHref(safeHref)) {
                row = (
                  <a
                    href={safeHref}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block"
                  >
                    {rowInner}
                  </a>
                );
              } else {
                row = (
                  <Link href={safeHref} className="block">
                    {rowInner}
                  </Link>
                );
              }

              return (
                <li
                  key={article._id}
                  className="border-b border-[rgba(226,226,226,0.5)]"
                >
                  {row}
                </li>
              );
            })}
          </ul>
        )}

        {/* View more */}
        {hasMore ? (
          <div className="mt-12 flex justify-center">
            <Link
              href={viewMoreHref}
              scroll={false}
              className="rounded-[50px] border-[0.75px] border-[#848484] px-7 py-2.5 text-[14px] leading-none text-[#181818] transition-colors hover:bg-black/5"
            >
              {t('viewMore')}
            </Link>
          </div>
        ) : null}
      </div>
    </main>
  );
}
