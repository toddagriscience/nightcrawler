// Copyright © Todd Agriscience, Inc. All rights reserved.

'use client';

/**
 * @fileoverview
 * Navbar search form with a dynamic dropdown that previews the
 * top 3 IMPs and top 3 seed products as the user types.
 *
 * - On focus with an empty query the dropdown shows the first 3 items
 *   from each category (no embeddings).
 * - Typing debounces for one second before fetching results ranked by
 *   cosine similarity, with a skeleton shown during the wait.
 * - Submitting navigates to the full `/search` results page.
 */

import { useCallback, useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { fetchDropdownItems } from './actions';
import { SearchDropdown } from './search-dropdown';
import type { DropdownResults } from './types';

/** Debounce interval (ms) before a search query triggers a server call. */
const DEBOUNCE_MS = 1_000;

/**
 * Navbar search form that combines a traditional `GET /search` submit
 * with a live dropdown preview powered by cached server actions.
 *
 * @returns Interactive search input with dropdown suggestions
 */
export function SearchNavForm() {
  const router = useRouter();

  /** Whether the dropdown panel is visible. */
  const [isOpen, setIsOpen] = useState(false);

  /** Whether we are waiting for the debounced search result. */
  const [isLoading, setIsLoading] = useState(false);

  /** Current dropdown content (null until first load). */
  const [results, setResults] = useState<DropdownResults | null>(null);

  /** Current raw value of the search input. */
  const [query, setQuery] = useState('');

  /** Tracks the active debounce timeout so it can be cancelled. */
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  /** Tracks whether default items have been loaded already. */
  const defaultsLoadedRef = useRef(false);

  /** Wrapper ref used for outside-click detection. */
  const wrapperRef = useRef<HTMLDivElement>(null);

  /**
   * Loads dropdown items from the server action.
   * Updates the results state and clears the loading flag.
   */
  const loadItems = useCallback(async (searchQuery: string) => {
    try {
      const data = await fetchDropdownItems(searchQuery);
      setResults(data);
    } catch {
      setResults({ imps: [], seeds: [] });
    } finally {
      setIsLoading(false);
    }
  }, []);

  /**
   * Loads default (non-embedding) items on first focus.
   * Skipped if items have already been loaded.
   */
  const loadDefaults = useCallback(async () => {
    if (defaultsLoadedRef.current) return;
    defaultsLoadedRef.current = true;
    setIsLoading(true);
    await loadItems('');
  }, [loadItems]);

  /* ------------------------------------------------------------------ */
  /*  Debounced search whenever the query changes                       */
  /* ------------------------------------------------------------------ */
  useEffect(() => {
    // Only debounce when the dropdown is open and query is non-empty.
    if (!isOpen || query.trim().length === 0) return;

    debounceRef.current = setTimeout(() => {
      loadItems(query);
    }, DEBOUNCE_MS);

    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
    };
  }, [query, isOpen, loadItems]);

  /* ------------------------------------------------------------------ */
  /*  Close dropdown on outside click                                   */
  /* ------------------------------------------------------------------ */
  useEffect(() => {
    /**
     * Closes the dropdown when the user clicks outside the wrapper.
     *
     * @param event - The mouse event from the document listener
     */
    function handleClickOutside(event: MouseEvent) {
      if (
        wrapperRef.current &&
        !wrapperRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  /**
   * Opens the dropdown and loads defaults if this is the first focus.
   */
  function handleFocus() {
    setIsOpen(true);
    if (query.trim().length === 0) {
      loadDefaults();
    } else {
      // Opening with an existing query — show skeleton while the effect
      // re-debounces a fetch for the current query.
      setIsLoading(true);
    }
  }

  /**
   * Tracks user input, resets to defaults when cleared.
   *
   * @param event - The change event from the search input
   */
  function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
    const value = event.target.value;
    setQuery(value);

    if (value.trim().length === 0) {
      // Cancel any pending debounce and reload defaults.
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
      setIsLoading(false);
      loadDefaults();
    } else {
      // User is typing — show skeleton immediately, effect handles the fetch.
      setIsLoading(true);
    }
  }

  /**
   * Navigates to the full search page on form submit.
   *
   * @param event - The form submission event
   */
  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsOpen(false);
    const trimmed = query.trim();
    if (trimmed) {
      router.push(`/search?q=${encodeURIComponent(trimmed)}`);
    } else {
      router.push('/search');
    }
  }

  return (
    <div ref={wrapperRef} className="relative w-full max-w-sm">
      <form
        onSubmit={handleSubmit}
        className="flex w-full items-center"
        role="search"
        aria-label="Search knowledge base"
      >
        <label htmlFor="header-search" className="sr-only">
          Search knowledge base
        </label>
        <div className="relative min-w-0 flex-1">
          <Button
            type="submit"
            variant="ghost"
            size="icon"
            className="text-muted-foreground hover:text-foreground absolute top-1/2 left-1 h-6 w-6 -translate-y-1/2 rounded-full hover:bg-transparent"
            aria-label="Search"
          >
            <Search className="size-4" />
          </Button>
          <Input
            id="header-search"
            name="q"
            type="search"
            placeholder="Search"
            autoComplete="off"
            className="h-7.5 min-w-0 flex-1 pl-10"
            value={query}
            onChange={handleChange}
            onFocus={handleFocus}
          />
        </div>
      </form>

      {isOpen && (
        <SearchDropdown
          results={results}
          isLoading={isLoading}
          onItemClick={() => setIsOpen(false)}
        />
      )}
    </div>
  );
}
