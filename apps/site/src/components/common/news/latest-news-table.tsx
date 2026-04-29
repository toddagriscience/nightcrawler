// Copyright © Todd Agriscience, Inc. All rights reserved.

'use client';

import type { SanityArticle } from '@/lib/sanity/article-types';
import { getArticleCardHref } from '@/lib/sanity/article-urls';
import clsx from 'clsx';
import { ExternalLink } from 'lucide-react';
import { useLocale } from 'next-intl';
import Link from 'next/link';
import { useState } from 'react';
import { HiArrowLongDown } from 'react-icons/hi2';

interface LatestNewsTableProps {
  items: SanityArticle[];
}

/** Formats listing dates with a safe fallback when `date` is missing. */
function formatArticleListingDate(
  dateValue: string | undefined,
  locale: string
): string {
  const safe = dateValue !== undefined && dateValue.length > 0 ? dateValue : '';
  if (safe.length === 0) return '';
  return new Date(safe).toLocaleDateString(locale, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

export function LatestNewsTable({ items }: LatestNewsTableProps) {
  const [visibleCount, setVisibleCount] = useState(3); // Show first 3 items initially
  const isAllShown = visibleCount >= items.length;

  const handleLoadMore = () => {
    setVisibleCount((prev) => prev + 3); // Show 3 more each time
  };

  const locale = useLocale();

  return (
    <div className="rounded-md text-[#555555] mx-auto px-2 md:px-6 flex flex-col justify-center">
      <div className="grid sm:grid-cols-3 grid-cols-3 border-b border-[#555555] px-2 md:px-4 py-2 text-xs uppercase">
        <span>Headline</span>
        <span className="text-right">Source</span>
        <span className="text-right">Date</span>
      </div>

      {items.slice(0, visibleCount).map((item, index) => (
        <div
          key={item.slug.current}
          className={clsx(
            'grid sm:grid-cols-3 grid-cols-3 items-center px-2 md:px-4 py-3 md:py-4 lg:py-5 text-sm sm:text-normal font-light',
            index !== visibleCount - 1 &&
              index !== items.length - 1 &&
              'border-b border-[#555555]'
          )}
        >
          <div>{item.title}</div>

          <Link
            href={getArticleCardHref(item)}
            rel="noopener noreferrer"
            aria-label={`Open ${item.title} in this tab`}
          >
            <div className="flex items-center justify-end text-right gap-1 hover:underline">
              {item.source}
              <ExternalLink className="h-3.5 w-3.5 transition" />
            </div>
          </Link>

          <div className="text-right">
            {formatArticleListingDate(item.date, locale)}
          </div>
        </div>
      ))}

      {!isAllShown && (
        <div
          role="button"
          onClick={handleLoadMore}
          className="mt-6 md:mt-8 ml-2 md:ml-4 cursor-pointer text-left text-base sm:text-lg md:text-xl hover:underline w-fit"
        >
          Load more{' '}
          <HiArrowLongDown className="mt-1 size-6 md:size-8 inline-block" />
        </div>
      )}
    </div>
  );
}
