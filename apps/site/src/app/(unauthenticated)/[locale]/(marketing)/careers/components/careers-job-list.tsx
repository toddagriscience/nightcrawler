// Copyright © Todd Agriscience, Inc. All rights reserved.

'use client';

import { formatArticleListDate } from '@/lib/sanity/article-display-dates';
import type { SanityArticle } from '@/lib/sanity/article-types';
import { getArticleCardHref } from '@/lib/sanity/article-urls';
import { Link } from '@/i18n/config';
import { useTranslations } from 'next-intl';

interface CareersJobListProps {
  /** Careers collection documents from Sanity */
  items: SanityArticle[];
}

function isExternalPosting(
  article: Pick<SanityArticle, 'offSiteUrl'>
): boolean {
  const url = article.offSiteUrl;
  return url !== undefined && url !== null && String(url).trim() !== '';
}

/**
 * Row-based postings: job title, Apply →, posting date, location. No header row.
 */
export function CareersJobList({ items }: CareersJobListProps) {
  const t = useTranslations('careers');

  return (
    <ul className="mx-auto max-w-4xl list-none px-2 text-[#555555] md:px-6">
      {items.map((item) => {
        const href = getArticleCardHref(item);
        const external = isExternalPosting(item);
        const locationDisplay =
          [item.jobLocation, item.company].find(
            (s) => s !== undefined && String(s).trim() !== ''
          ) ?? '';
        const dateLabel = formatArticleListDate(item.date);

        const applyControl = external ? (
          <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex shrink-0 text-sm font-medium underline underline-offset-4 transition hover:opacity-80"
          >
            {t('jobListings.apply')}
          </a>
        ) : (
          <Link
            href={href}
            className="inline-flex shrink-0 text-sm font-medium underline underline-offset-4 transition hover:opacity-80"
          >
            {t('jobListings.apply')}
          </Link>
        );

        return (
          <li
            key={item.slug.current}
            className="border-b border-[#555555]/40 py-4 md:py-5"
          >
            <div className="grid grid-cols-1 gap-3 md:grid-cols-[minmax(0,1fr)_auto_auto_auto] md:items-center md:gap-8">
              <div className="min-w-0 text-base font-light md:text-lg">
                {item.title}
              </div>
              <div className="md:order-none">{applyControl}</div>
              <span className="text-sm font-light md:text-right">
                {dateLabel}
              </span>
              <span className="text-sm font-light md:text-right">
                {locationDisplay}
              </span>
            </div>
          </li>
        );
      })}
    </ul>
  );
}
