// Copyright © Todd Agriscience, Inc. All rights reserved.

import Link from 'next/link';
import type { DropdownItem, DropdownResults } from './types';
import { SearchDropdownSkeleton } from './search-dropdown-skeleton';

/**
 * Resolves the destination URL for a dropdown item.
 *
 * @param item - The dropdown item to build a link for
 * @returns The absolute path for the item's detail page
 */
function getItemHref(item: DropdownItem): string {
  return item.resultType === 'seed'
    ? `/product/${item.slug}`
    : `/imp/${item.slug}`;
}

/** Props for the {@link SearchDropdown} component. */
interface SearchDropdownProps {
  /** Current categorized results to display. */
  results: DropdownResults | null;
  /** Whether the dropdown is currently loading new results. */
  isLoading: boolean;
  /** Callback invoked when the user clicks a dropdown item. */
  onItemClick: () => void;
}

/**
 * Floating dropdown rendered beneath the navbar search input.
 * Displays categorized IMP and seed product results, or a
 * skeleton placeholder while results are being fetched.
 *
 * @param props - {@link SearchDropdownProps}
 * @returns The search dropdown panel
 */
export function SearchDropdown({
  results,
  isLoading,
  onItemClick,
}: SearchDropdownProps) {
  if (isLoading) {
    return (
      <div
        className="bg-white border-border absolute top-full right-0 left-0 z-50 mt-1 overflow-hidden rounded-md border shadow-lg"
        role="listbox"
        aria-label="Search suggestions loading"
      >
        <SearchDropdownSkeleton />
      </div>
    );
  }

  if (!results) {
    return null;
  }

  const hasImps = results.imps.length > 0;
  const hasSeeds = results.seeds.length > 0;

  if (!hasImps && !hasSeeds) {
    return (
      <div
        className="bg-white border-border absolute top-full right-0 left-0 z-50 mt-1 overflow-hidden rounded-md border shadow-lg"
        role="listbox"
        aria-label="Search suggestions"
      >
        <p className="text-muted-foreground p-3 text-center text-sm">
          No results found.
        </p>
      </div>
    );
  }

  return (
    <div
      className="bg-white border-border absolute top-full right-0 left-0 z-50 mt-1 overflow-hidden rounded-md border shadow-lg"
      role="listbox"
      aria-label="Search suggestions"
    >
      {hasImps && (
        <div>
          <p className="text-muted-foreground border-b px-3 pt-2 pb-1 text-xs font-semibold uppercase tracking-wider">
            IMPs
          </p>
          <ul>
            {results.imps.map((item) => (
              <li key={`imp-${item.id}`} role="option" aria-selected={false}>
                <Link
                  href={getItemHref(item)}
                  onClick={onItemClick}
                  className="text-popover-foreground hover:bg-accent block truncate px-3 py-1.5 text-sm transition-colors"
                >
                  {item.title}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}

      {hasSeeds && (
        <div>
          <p className="text-muted-foreground border-b px-3 pt-2 pb-1 text-xs font-semibold uppercase tracking-wider">
            Seed Products
          </p>
          <ul>
            {results.seeds.map((item) => (
              <li key={`seed-${item.id}`} role="option" aria-selected={false}>
                <Link
                  href={getItemHref(item)}
                  onClick={onItemClick}
                  className="text-popover-foreground hover:bg-accent block truncate px-3 py-1.5 text-sm transition-colors"
                >
                  {item.title}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
