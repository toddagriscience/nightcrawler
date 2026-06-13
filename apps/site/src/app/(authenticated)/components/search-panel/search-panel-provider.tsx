// Copyright © Todd Agriscience, Inc. All rights reserved.

'use client';

import { useCallback, useMemo, useState } from 'react';
import { searchKnowledge } from '@/lib/ai/search';
import { logger } from '@/lib/logger';
import type { SearchResult } from '@/lib/ai/types';
import { SearchPanelContext } from './search-panel-context';

/**
 * Provides shared search panel state to the dashboard. Holds the query,
 * results, and open/collapsed state so the panel keeps its results when
 * collapsed and only refreshes on a new search.
 *
 * @param props.children - The dashboard subtree that can read the context
 * @returns The provider wrapping its children
 */
export function SearchPanelProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  const runSearch = useCallback(async (rawQuery: string) => {
    const trimmed = rawQuery.trim();
    if (trimmed.length === 0) return;

    setQuery(trimmed);
    setHasSearched(true);
    setIsOpen(true);
    setIsLoading(true);
    setError(null);

    try {
      const data = await searchKnowledge(trimmed);
      setResults(data);
    } catch (searchError) {
      logger.error('[SearchPanel] Search failed:', searchError);
      setResults([]);
      setError('Search failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const expand = useCallback(() => setIsOpen(true), []);
  const collapse = useCallback(() => setIsOpen(false), []);

  const value = useMemo(
    () => ({
      query,
      results,
      error,
      isLoading,
      isOpen,
      hasSearched,
      runSearch,
      expand,
      collapse,
    }),
    [
      query,
      results,
      error,
      isLoading,
      isOpen,
      hasSearched,
      runSearch,
      expand,
      collapse,
    ]
  );

  return (
    <SearchPanelContext.Provider value={value}>
      {children}
    </SearchPanelContext.Provider>
  );
}
