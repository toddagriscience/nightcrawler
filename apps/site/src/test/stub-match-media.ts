// Copyright © Todd Agriscience, Inc. All rights reserved.

import { vi } from 'vitest';

type ChangeListener = (event: { matches: boolean }) => void;

/**
 * Installs a `window.matchMedia` stub — jsdom ships none, so any component
 * using `useMediaQuery` throws without it. Returns controls to flip the match
 * state (notifying `change` listeners) and to inspect listener bookkeeping.
 * Pair with `vi.unstubAllGlobals()` in `afterEach`.
 *
 * @param {boolean} initialMatches - Whether every query matches to begin with
 * @returns Controls for the stubbed media query list
 */
export function stubMatchMedia(initialMatches: boolean) {
  // Array rather than Set: the drizzle lint plugin false-positives on any
  // `.delete(...)` call, including Set.prototype.delete.
  let listeners: ChangeListener[] = [];
  let matches = initialMatches;

  const mediaQueryList = {
    get matches() {
      return matches;
    },
    media: '',
    addEventListener: (_type: string, listener: ChangeListener) => {
      listeners.push(listener);
    },
    removeEventListener: (_type: string, listener: ChangeListener) => {
      listeners = listeners.filter((existing) => existing !== listener);
    },
  };

  vi.stubGlobal(
    'matchMedia',
    vi.fn(() => mediaQueryList)
  );

  return {
    setMatches: (next: boolean) => {
      matches = next;
      listeners.forEach((listener) => listener({ matches: next }));
    },
    listenerCount: () => listeners.length,
  };
}
