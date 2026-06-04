// Copyright © Todd Agriscience, Inc. All rights reserved.

'use client';

import Link from 'next/link';
import { ChevronRight, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useSearchPanel } from './search-panel-context';
import { SearchResultCard } from './search-result-card';
import { SearchResultsSkeleton } from './search-results-skeleton';

/**
 * Slide-in search results panel for the dashboard. Pushes the dashboard
 * content narrower when open and collapses to a slim rail (keeping its
 * results) when collapsed. Renders nothing until the first search runs.
 *
 * @returns The results panel column
 */
export function SearchPanel() {
  const {
    query,
    results,
    error,
    isLoading,
    isOpen,
    hasSearched,
    expand,
    collapse,
  } = useSearchPanel();

  return (
    <aside
      className={cn(
        'border-foreground/10 flex shrink-0 flex-col overflow-hidden border-l transition-[width] duration-300 ease-in-out',
        !hasSearched ? 'w-0 border-l-0' : isOpen ? 'w-96' : 'w-12'
      )}
      aria-hidden={!hasSearched}
    >
      {hasSearched && !isOpen && (
        <div className="flex flex-col items-center py-3">
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={expand}
            aria-label="Show search results"
            className="text-muted-foreground hover:text-foreground"
          >
            <Search className="size-4" />
          </Button>
        </div>
      )}

      {hasSearched && isOpen && (
        <>
          <div className="flex items-center justify-between gap-2 px-4 py-3">
            <div className="min-w-0">
              <p className="text-foreground text-sm font-medium">
                Search results
              </p>
              {query && (
                <p className="text-foreground/60 truncate text-xs">
                  for “{query}”
                </p>
              )}
            </div>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={collapse}
              aria-label="Collapse search results"
              className="text-muted-foreground hover:text-foreground"
            >
              <ChevronRight className="size-4" />
            </Button>
          </div>

          <div className="flex-1 overflow-auto px-4 pb-4">
            {isLoading && <SearchResultsSkeleton />}

            {!isLoading && error && <p className="text-red-600">{error}</p>}

            {!isLoading && !error && results.length === 0 && (
              <div className="p-2 text-center">
                <p className="text-foreground/80 mb-2">
                  We don&apos;t have information on that topic yet.
                </p>
                <p className="text-foreground font-medium">
                  Please{' '}
                  <Link href="/contact" className="underline hover:opacity-70">
                    contact a Todd advisor
                  </Link>{' '}
                  for help.
                </p>
              </div>
            )}

            {!isLoading && !error && results.length > 0 && (
              <div className="space-y-4">
                {results.map((result) => (
                  <SearchResultCard
                    key={`${result.resultType}-${result.id}`}
                    result={result}
                  />
                ))}
              </div>
            )}
          </div>
        </>
      )}
    </aside>
  );
}
