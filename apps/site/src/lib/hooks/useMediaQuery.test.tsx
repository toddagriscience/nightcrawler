// Copyright © Todd Agriscience, Inc. All rights reserved.

import { stubMatchMedia } from '@/test/stub-match-media';
import { act, renderHook } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import useMediaQuery from './useMediaQuery';

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
