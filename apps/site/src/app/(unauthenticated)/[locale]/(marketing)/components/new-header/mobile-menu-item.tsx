// Copyright © Todd Agriscience, Inc. All rights reserved.

'use client';

import { Link } from '@/i18n/config';
import { cn } from '@/lib/utils';
import { useState } from 'react';
import { MobileMenuItemProps } from './types';

/**
 * Renders a single mobile menu entry. Items with children expand inline to
 * reveal sub-links; leaf items navigate directly and close the parent sheet.
 *
 * Uses the locale-aware `Link` from `@/i18n/config` so that internal navigation
 * preserves the active locale prefix (e.g. `/es/about` instead of `/about`).
 *
 * @param props - The menu item and a callback invoked after navigation.
 * @returns A bordered list entry with optional expandable sub-links.
 */
export default function MobileMenuItem({
  item,
  onNavigate,
}: MobileMenuItemProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  if (item.items?.length) {
    return (
      <div className="border-b border-border/30 border-[#E0E0E0] py-2">
        <button
          type="button"
          aria-expanded={isExpanded}
          onClick={() => setIsExpanded((prev) => !prev)}
          className="flex w-full items-center gap-4 py-3 text-[22px] font-normal"
        >
          <span>{item.title}</span>
          <span
            aria-hidden="true"
            className={cn(
              'h-2 w-2 border-b border-r border-current transition-transform duration-200',
              isExpanded ? '-rotate-[135deg]' : 'rotate-45'
            )}
          />
        </button>
        {isExpanded ? (
          <ul className="flex flex-col gap-2 pb-3 pl-4">
            {item.items.map((subItem) => (
              <li key={subItem.title}>
                {isExternalOrHash(subItem.url) ? (
                  <a
                    href={subItem.url}
                    className="block py-1 text-lg font-thin hover:opacity-70"
                    onClick={onNavigate}
                  >
                    {subItem.title}
                  </a>
                ) : (
                  <Link
                    href={subItem.url}
                    className="block py-1 text-lg font-thin hover:opacity-70"
                    onClick={onNavigate}
                  >
                    {subItem.title}
                  </Link>
                )}
              </li>
            ))}
          </ul>
        ) : null}
      </div>
    );
  }

  if (isExternalOrHash(item.url)) {
    return (
      <a
        href={item.url}
        className="block border-b border-[#E0E0E0] border-border/30 py-3 gap-4 text-[22px] font-normal"
        onClick={onNavigate}
      >
        {item.title}
      </a>
    );
  }

  return (
    <Link
      href={item.url}
      className="block border-b border-[#E0E0E0] border-border/30 py-3 gap-4 text-[22px] font-normal"
      onClick={onNavigate}
    >
      {item.title}
    </Link>
  );
}

/**
 * Treat hashes and absolute URLs as opaque hrefs so we don't run them through
 * next-intl's locale-aware `Link`, which expects internal pathnames.
 */
function isExternalOrHash(url: string): boolean {
  return url.startsWith('#') || /^[a-z][a-z0-9+.-]*:/i.test(url);
}
