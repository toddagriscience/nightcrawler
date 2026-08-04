// Copyright © Todd Agriscience, Inc. All rights reserved.

import { render } from '@testing-library/react';
import '@testing-library/jest-dom';
import { afterEach, describe, expect, it, vi } from 'vitest';
import SmoothScroll from './smooth-scroll';

const destroy = vi.fn();

vi.mock('@studio-freight/lenis', () => ({
  default: class {
    raf = vi.fn();
    scrollTo = vi.fn();
    destroy = destroy;
  },
}));

describe('SmoothScroll', () => {
  afterEach(() => {
    vi.restoreAllMocks();
    destroy.mockClear();
  });

  it('renders its children', () => {
    const { getByText } = render(
      <SmoothScroll>
        <p>content</p>
      </SmoothScroll>
    );

    expect(getByText('content')).toBeInTheDocument();
  });

  it('cancels its animation frame loop on unmount so it does not run forever', () => {
    const cancelSpy = vi.spyOn(window, 'cancelAnimationFrame');

    const { unmount } = render(
      <SmoothScroll>
        <p>content</p>
      </SmoothScroll>
    );

    unmount();

    // The raf chain re-schedules itself every frame; without an explicit
    // cancel it would keep running for the life of the page and accumulate
    // one extra loop per remount.
    expect(cancelSpy).toHaveBeenCalled();
    expect(destroy).toHaveBeenCalled();
  });

  it('does not leave a global lenis instance behind after unmount', () => {
    const { unmount } = render(
      <SmoothScroll>
        <p>content</p>
      </SmoothScroll>
    );

    unmount();

    expect(window.lenis).toBeUndefined();
  });
});
