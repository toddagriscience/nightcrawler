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

/** Shape of the search-panel context value. */
interface SearchPanelValue {
  /** Whether the right-side search panel is currently open. */
  open: boolean;
  /** Query to seed the panel input with on the next open (consumed by the body). */
  initialQuery: string;
  /** Opens the panel, optionally seeding the search input with a query. */
  openPanel: (query?: string) => void;
  /** Closes the panel. */
  closePanel: () => void;
  /** Toggles the panel open/closed. */
  toggle: () => void;
}

const SearchPanelContext = createContext<SearchPanelValue | null>(null);

/**
 * Provides the global open state for the right-side search panel.
 *
 * Unlike the sidebar collapse state, this is intentionally NOT persisted — the
 * panel should always start closed on a fresh load. Wrap the authenticated shell
 * layout with this provider.
 *
 * @param {ReactNode} children - Subtree that can read/toggle the panel state
 * @returns {React.ReactNode} - The provider
 */
export function SearchPanelProvider({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);
  const [initialQuery, setInitialQuery] = useState('');

  const openPanel = useCallback((query = '') => {
    setInitialQuery(query);
    setOpen(true);
  }, []);
  const closePanel = useCallback(() => setOpen(false), []);
  const toggle = useCallback(() => {
    setInitialQuery('');
    setOpen((current) => !current);
  }, []);

  const value = useMemo(
    () => ({ open, initialQuery, openPanel, closePanel, toggle }),
    [open, initialQuery, openPanel, closePanel, toggle]
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
 * @returns {SearchPanelValue} - Current open state and open/close/toggle actions
 */
export function useSearchPanel(): SearchPanelValue {
  const context = useContext(SearchPanelContext);
  if (!context) {
    throw new Error('useSearchPanel must be used within a SearchPanelProvider');
  }
  return context;
}
