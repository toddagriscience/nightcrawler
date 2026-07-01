// Copyright © Todd Agriscience, Inc. All rights reserved.

'use client';

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import type { ReactNode } from 'react';
import type { SearchResult } from '@/lib/ai/types';

/** Shape of the search-panel context value. */
interface SearchPanelValue {
  /** Whether the right-side results panel is expanded. */
  open: boolean;
  /** Whether the command-palette search popup is open. */
  modalOpen: boolean;
  /** Active inference-search query shown in the results panel. */
  activeQuery: string;
  /** Results for the active query. */
  results: SearchResult[];
  /** Whether a search request is in flight. */
  isSearching: boolean;
  /** Whether the most recent search failed. */
  searchError: boolean;
  /** Opens the command-palette popup (sidebar Search action). */
  openModal: () => void;
  /** Closes the command-palette popup. */
  closeModal: () => void;
  /** Expands a collapsed results panel without changing the active search. */
  expandPanel: () => void;
  /** Collapses the results panel while keeping the active search. */
  collapsePanel: () => void;
  /**
   * Runs a new inference search, opens the results panel, and replaces any
   * prior query/results.
   */
  submitSearch: (query: string) => void;
}

const SearchPanelContext = createContext<SearchPanelValue | null>(null);

/**
 * Provides global state for the search popup and right-side results panel.
 *
 * The inference request runs here, in the always-mounted provider, rather than
 * in the panel body: collapsing the panel unmounts the body, so running the
 * request there left `isSearching` stuck true and re-fired a duplicate request
 * on re-expand, and a failed search's error was lost on unmount.
 *
 * @param {ReactNode} children - Subtree that can read/toggle search UI state
 * @returns {React.ReactNode} - The provider
 */
export function SearchPanelProvider({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [activeQuery, setActiveQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [searchError, setSearchError] = useState(false);

  // Bumped on every submit so a slow in-flight response can't overwrite the
  // results of a newer query.
  const requestIdRef = useRef(0);

  const openModal = useCallback(() => setModalOpen(true), []);
  const closeModal = useCallback(() => setModalOpen(false), []);

  const expandPanel = useCallback(() => setOpen(true), []);
  const collapsePanel = useCallback(() => setOpen(false), []);

  const submitSearch = useCallback((query: string) => {
    const trimmed = query.trim();
    if (!trimmed) return;
    setActiveQuery(trimmed);
    setResults([]);
    setSearchError(false);
    setOpen(true);
    setModalOpen(false);
    setIsSearching(true);
  }, []);

  // Run the inference search whenever a new query is submitted. Keyed on
  // isSearching (set true by submitSearch) so re-submitting the same query
  // still re-runs; the requestId guard drops stale/out-of-order responses.
  useEffect(() => {
    if (!activeQuery || !isSearching) return;

    const requestId = requestIdRef.current + 1;
    requestIdRef.current = requestId;

    // Loaded lazily so this widely-imported client context does not statically
    // pull the server action's module graph (and its eager OpenAI client) into
    // every consumer's bundle/test import chain.
    import('@/app/(authenticated)/actions/inference-search')
      .then(({ runInferenceSearch }) => runInferenceSearch(activeQuery))
      .then((nextResults) => {
        if (requestId !== requestIdRef.current) return;
        setResults(nextResults);
        setSearchError(false);
        setIsSearching(false);
      })
      .catch(() => {
        if (requestId !== requestIdRef.current) return;
        setResults([]);
        setSearchError(true);
        setIsSearching(false);
      });
  }, [activeQuery, isSearching]);

  const value = useMemo(
    () => ({
      open,
      modalOpen,
      activeQuery,
      results,
      isSearching,
      searchError,
      openModal,
      closeModal,
      expandPanel,
      collapsePanel,
      submitSearch,
    }),
    [
      open,
      modalOpen,
      activeQuery,
      results,
      isSearching,
      searchError,
      openModal,
      closeModal,
      expandPanel,
      collapsePanel,
      submitSearch,
    ]
  );

  return (
    <SearchPanelContext.Provider value={value}>
      {children}
    </SearchPanelContext.Provider>
  );
}

/**
 * Reads the global search-panel state. Must be used within a
 * {@link SearchPanelProvider}.
 *
 * @returns {SearchPanelValue} - Current search UI state and actions
 */
export function useSearchPanel(): SearchPanelValue {
  const context = useContext(SearchPanelContext);
  if (!context) {
    throw new Error('useSearchPanel must be used within a SearchPanelProvider');
  }
  return context;
}
