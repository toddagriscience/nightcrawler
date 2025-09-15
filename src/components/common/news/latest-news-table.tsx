'use client';

import { useState } from 'react';
import { ExternalLink } from 'lucide-react';
import Link from 'next/link';
import clsx from 'clsx';
import NewsCardProps from '../news-card/types/news-card';

interface LatestNewsTableProps {
  items: NewsCardProps[];
}

export function LatestNewsTable({ items }: LatestNewsTableProps) {
  const [visibleCount, setVisibleCount] = useState(3); // Show first 3 items initially
  const isAllShown = visibleCount >= items.length;

  const handleLoadMore = () => {
    setVisibleCount((prev) => prev + 3); // Show 3 more each time
  };

  return (
    <div className="rounded-md text-[#555555]">
      <div className="grid grid-cols-3 border-b border-[#555555] px-4 py-2 text-xs uppercase">
        <span>Headline</span>
        <span className="text-right">Source Type</span>
        <span className="text-right">Date</span>
      </div>

      {items.slice(0, visibleCount).map((item, index) => (
        <div
          key={item.slug}
          className={clsx(
            'grid grid-cols-3 items-center px-4 py-4 text-sm',
            index !== visibleCount - 1 &&
              index !== items.length - 1 &&
              'border-b border-[#555555]'
          )}
        >
          <div>{item.title}</div>

          <div className="flex items-center justify-end gap-1">
            {item.source}
            <Link
              href={
                item.slug.startsWith('http')
                  ? item.slug
                  : `https://toddagriscience.com/news/${item.slug}`
              }
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`Open ${item.title} in new tab`}
            >
              <ExternalLink className="h-3.5 w-3.5 transition hover:opacity-70" />
            </Link>
          </div>

          <div className="text-right">
            {new Date(item.date + 'T00:00:00Z').toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
          </div>
        </div>
      ))}

      {!isAllShown && (
        <div
          onClick={handleLoadMore}
          className="cursor-pointer px-4 py-4 text-left text-sm hover:underline"
        >
          Load more ↓
        </div>
      )}
    </div>
  );
}
