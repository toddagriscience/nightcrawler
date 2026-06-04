// Copyright © Todd Agriscience, Inc. All rights reserved.

'use client';

import { createContext, useContext } from 'react';
import type { SearchResult } from '@/lib/ai/types';

/** Shared state and controls for the dashboard search panel. */
export interface SearchPanelContextValue {
  /** The query reflected in the panel. */
  query: string;
  /** Results from the most recent search. */
  results: SearchResult[];
  /** Error message from the most recent search, if any. */
  error: string | null;
  /** Whether a search request is in flight. */
  isLoading: boolean;
  /** Whether the panel is expanded (vs. collapsed to a rail). */
  isOpen: boolean;
  /** Whether at least one search has run this session. */
  hasSearched: boolean;
  /** Runs a search, opening the panel and replacing its results. */
  runSearch: (query: string) => void;
  /** Expands the panel to its full width. */
  expand: () => void;
  /** Collapses the panel to a slim rail, keeping its results. */
  collapse: () => void;
}

/** No-op default so consumers render harmlessly without a provider. */
const defaultValue: SearchPanelContextValue = {
  query: '',
  results: [],
  error: null,
  isLoading: false,
  isOpen: false,
  hasSearched: false,
  runSearch: () => {},
  expand: () => {},
  collapse: () => {},
};

export const SearchPanelContext =
  createContext<SearchPanelContextValue>(defaultValue);

/**
 * Accesses the search panel context. Returns no-op defaults when used
 * outside a `SearchPanelProvider`.
 *
 * @returns The shared search panel state and controls
 */
export function useSearchPanel(): SearchPanelContextValue {
  return useContext(SearchPanelContext);
}
