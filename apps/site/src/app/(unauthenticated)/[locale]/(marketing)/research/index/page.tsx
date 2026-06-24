// Copyright © Todd Agriscience, Inc. All rights reserved.

import { Link } from '@/i18n/config';
import { formatArticleListDate } from '@/lib/sanity/article-display-dates';
import {
  type ArticleContentType,
  type SanityArticle,
} from '@/lib/sanity/article-types';
import { getArticleCardHref } from '@/lib/sanity/article-urls';
import { getArticlesByCollection } from '@/lib/sanity/articles';
import { getTranslations } from 'next-intl/server';
import { BiChevronDown } from 'react-icons/bi';
import { LuLayoutGrid, LuMenu } from 'react-icons/lu';

/** How many rows are visible initially and revealed per "View more" click. */
const PAGE_SIZE = 9;

/**
 * Content-type filter tabs, in render order. Only types with at least one
 * article appear. `news` is intentionally not a tab but is still labelled on rows.
 */
const TAB_CONTENT_TYPES: ArticleContentType[] = [
  'research',
  'story',
  'product-release',
  'press',
];

/** Maps a `contentType` to its `researchIndex.tabs.*` translation key. */
const CONTENT_TYPE_TAB_KEY: Record<ArticleContentType, string> = {
  news: 'news',
  research: 'research',
  story: 'story',
  'product-release': 'productRelease',
  press: 'press',
};

/** Whether a card href points off-site (absolute URL) vs an internal route. */
function isExternalHref(href: string): boolean {
  return /^https?:\/\//i.test(href);
}

/** An article's effective content type (`news` is the Sanity default). */
function contentTypeOf(article: SanityArticle): ArticleContentType {
  return article.contentType ?? 'news';
}

/**
 * Research & product-release listing (`/{locale}/research/index`).
 *
 * Server-renders Sanity `research` articles with a content-type filter bar and a
 * divided list of rows that link to each article's detail route. The active
 * category and revealed count are driven by the `?category=` / `?count=` search
 * params so filtering and pagination stay server-rendered and shareable.
 *
 * @param props - Page props
 * @param props.params - Route params (`locale` selects the translation locale)
 * @param props.searchParams - Search params (`category` selects the active tab, `count` reveals rows)
 * @returns {JSX.Element} The research listing page
 */
export default async function ResearchIndexPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ category?: string; count?: string }>;
}) {
  const { locale } = await params;
  const { category, count } = await searchParams;
  const t = await getTranslations({ locale, namespace: 'researchIndex' });

  const articles = await getArticlesByCollection('research');

  // Tabs: 'all' + each content type present in the fetched set (fixed order).
  const presentTypes = TAB_CONTENT_TYPES.filter((type) =>
    articles.some((article) => contentTypeOf(article) === type)
  );
  const activeCategory: ArticleContentType | 'all' =
    presentTypes.find((type) => type === (category ?? '').toLowerCase()) ??
    'all';

  const filteredItems =
    activeCategory === 'all'
      ? articles
      : articles.filter((article) => contentTypeOf(article) === activeCategory);

  const requestedCount = Number.parseInt(count ?? '', 10);
  const visibleCount = Math.min(
    Number.isFinite(requestedCount) && requestedCount > 0
      ? Math.max(requestedCount, PAGE_SIZE)
      : PAGE_SIZE,
    filteredItems.length
  );
  const visibleItems = filteredItems.slice(0, visibleCount);
  const hasMore = visibleCount < filteredItems.length;
  const nextCount = Math.min(visibleCount + PAGE_SIZE, filteredItems.length);
  const categoryQuery =
    activeCategory === 'all' ? '' : `category=${activeCategory}&`;

  const tabs: Array<{ key: string; href: string; label: string }> = [
    { key: 'all', href: '/research/index', label: t('tabs.all') },
    ...presentTypes.map((type) => ({
      key: type,
      href: `/research/index?category=${type}`,
      label: t(`tabs.${CONTENT_TYPE_TAB_KEY[type]}`),
    })),
  ];

  return (
    <main className="bg-white text-black">
      <div className="mx-auto w-full max-w-[1440px] px-6 pb-24 pt-12 sm:px-12 md:pt-16 lg:px-20">
        {/* Heading + toolbar */}
        <header className="flex flex-col gap-8 lg:gap-10">
          <h1 className="text-[40px] font-normal leading-tight sm:text-[48px] sm:leading-[64px]">
            {t('title')}
          </h1>

          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <nav aria-label={t('controls.filterNav')}>
              <ul className="flex flex-wrap items-center gap-x-6 gap-y-2">
                {tabs.map((tab) => (
                  <li key={tab.key}>
                    <Link
                      href={tab.href}
                      aria-current={
                        tab.key === activeCategory ? 'true' : undefined
                      }
                      className="text-[18px] font-normal leading-7 text-black transition-opacity hover:opacity-60 aria-[current=true]:underline aria-[current=true]:underline-offset-4"
                    >
                      {tab.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>

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
            {activeCategory === 'all'
              ? t('emptyAll')
              : t('empty', {
                  category: t(
                    `tabs.${CONTENT_TYPE_TAB_KEY[activeCategory]}`
                  ).toLowerCase(),
                })}
          </p>
        ) : (
          <ul className="mt-8">
            {visibleItems.map((article) => {
              const href = getArticleCardHref(article);
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
                    {article.summary ? (
                      <p className="mt-2 text-[14px] font-normal leading-[27px] text-black">
                        {article.summary}
                      </p>
                    ) : null}
                  </div>
                </div>
              );

              return (
                <li
                  key={article._id}
                  className="border-b border-[rgba(226,226,226,0.5)]"
                >
                  {isExternalHref(href) ? (
                    <a
                      href={href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block"
                    >
                      {rowInner}
                    </a>
                  ) : (
                    <Link href={href} className="block">
                      {rowInner}
                    </Link>
                  )}
                </li>
              );
            })}
          </ul>
        )}

        {/* View more */}
        {hasMore ? (
          <div className="mt-12 flex justify-center">
            <Link
              href={`/research/index?${categoryQuery}count=${nextCount}`}
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
