// Copyright © Todd Agriscience, Inc. All rights reserved.

import { act, renderHook } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import useMediaQuery from './useMediaQuery';

type ChangeListener = (event: { matches: boolean }) => void;

function stubMatchMedia(initialMatches: boolean) {
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

describe('useMediaQuery', () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('reports the current match state after mount', () => {
    stubMatchMedia(true);

    const { result } = renderHook(() => useMediaQuery('(min-width: 1024px)'));

    expect(result.current).toBe(true);
  });

  it('updates when the media query match changes', () => {
    const media = stubMatchMedia(false);

    const { result } = renderHook(() => useMediaQuery('(min-width: 1024px)'));
    expect(result.current).toBe(false);

    act(() => {
      media.setMatches(true);
    });

    expect(result.current).toBe(true);
  });

  it('removes its change listener on unmount', () => {
    const media = stubMatchMedia(false);

    const { unmount } = renderHook(() => useMediaQuery('(min-width: 1024px)'));
    expect(media.listenerCount()).toBe(1);

    unmount();

    expect(media.listenerCount()).toBe(0);
  });
});
