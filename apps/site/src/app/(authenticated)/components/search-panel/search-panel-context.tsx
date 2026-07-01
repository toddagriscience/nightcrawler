// Copyright © Todd Agriscience, Inc. All rights reserved.

'use client';

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from 'react';
import type { ReactNode } from 'react';
import type { SearchResult } from '@/lib/ai/types';

/** Shape of the search-panel context value. */
interface SearchPanelValue {
  /** Whether the right-side results panel is expanded. */
  open: boolean;
  /** Whether the results panel is collapsed while retaining the last query/results. */
  collapsed: boolean;
  /** Whether the command-palette search popup is open. */
  modalOpen: boolean;
  /** Active inference-search query shown in the results panel. */
  activeQuery: string;
  /** Results for the active query. */
  results: SearchResult[];
  /** Whether a search request is in flight. */
  isSearching: boolean;
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
  /** Marks the search request as finished and stores results. */
  setSearchResults: (query: string, results: SearchResult[]) => void;
  /** Marks the search request as in-flight. */
  setSearching: (searching: boolean) => void;
}

const SearchPanelContext = createContext<SearchPanelValue | null>(null);

/**
 * Provides global state for the search popup and right-side results panel.
 *
 * @param {ReactNode} children - Subtree that can read/toggle search UI state
 * @returns {React.ReactNode} - The provider
 */
export function SearchPanelProvider({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [activeQuery, setActiveQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  const openModal = useCallback(() => setModalOpen(true), []);
  const closeModal = useCallback(() => setModalOpen(false), []);

  const expandPanel = useCallback(() => {
    setCollapsed(false);
    setOpen(true);
  }, []);

  const collapsePanel = useCallback(() => {
    setCollapsed(true);
    setOpen(false);
  }, []);

  const submitSearch = useCallback((query: string) => {
    const trimmed = query.trim();
    if (!trimmed) return;
    setActiveQuery(trimmed);
    setResults([]);
    setCollapsed(false);
    setOpen(true);
    setModalOpen(false);
    setIsSearching(true);
  }, []);

  const setSearchResults = useCallback(
    (query: string, nextResults: SearchResult[]) => {
      setActiveQuery(query);
      setResults(nextResults);
      setIsSearching(false);
    },
    []
  );

  const setSearching = useCallback((searching: boolean) => {
    setIsSearching(searching);
  }, []);

  const value = useMemo(
    () => ({
      open,
      collapsed,
      modalOpen,
      activeQuery,
      results,
      isSearching,
      openModal,
      closeModal,
      expandPanel,
      collapsePanel,
      submitSearch,
      setSearchResults,
      setSearching,
    }),
    [
      open,
      collapsed,
      modalOpen,
      activeQuery,
      results,
      isSearching,
      openModal,
      closeModal,
      expandPanel,
      collapsePanel,
      submitSearch,
      setSearchResults,
      setSearching,
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
