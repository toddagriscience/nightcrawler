// Copyright © Todd Agriscience, Inc. All rights reserved.

'use client';

import {
  createContext,
  useCallback,
  useContext,
  useSyncExternalStore,
} from 'react';
import type { ReactNode } from 'react';

const STORAGE_KEY = 'sidebar-collapsed';

interface SidebarCollapseValue {
  collapsed: boolean;
  toggle: () => void;
}

const SidebarCollapseContext = createContext<SidebarCollapseValue | null>(null);

// Module-level store so the collapse choice is shared across every consumer and
// read straight from localStorage (an external system) via useSyncExternalStore.
let listeners: Array<() => void> = [];

function readCollapsed(): boolean {
  try {
    return localStorage.getItem(STORAGE_KEY) === 'true';
  } catch {
    return false;
  }
}

function subscribe(listener: () => void): () => void {
  listeners.push(listener);
  return () => {
    listeners = listeners.filter((current) => current !== listener);
  };
}

function setCollapsed(next: boolean): void {
  try {
    localStorage.setItem(STORAGE_KEY, String(next));
  } catch {
    // localStorage may be unavailable
  }
  listeners.forEach((listener) => listener());
}

/**
 * Provides the global sidebar collapse state, persisted to localStorage so the
 * choice survives reloads. Wrap the authenticated layout with this provider.
 *
 * @param {ReactNode} children - Subtree that can read/toggle collapse state
 * @returns {React.ReactNode} - The provider
 */
export function SidebarCollapseProvider({ children }: { children: ReactNode }) {
  const collapsed = useSyncExternalStore(subscribe, readCollapsed, () => false);

  const toggle = useCallback(() => {
    setCollapsed(!readCollapsed());
  }, []);

  return (
    <SidebarCollapseContext.Provider value={{ collapsed, toggle }}>
      {children}
    </SidebarCollapseContext.Provider>
  );
}

/**
 * Reads the global sidebar collapse state. Must be used within a
 * {@link SidebarCollapseProvider}.
 *
 * @returns {SidebarCollapseValue} - Current collapse state and a toggle function
 */
export function useSidebarCollapse(): SidebarCollapseValue {
  const context = useContext(SidebarCollapseContext);
  if (!context) {
    throw new Error(
      'useSidebarCollapse must be used within a SidebarCollapseProvider'
    );
  }
  return context;
}
