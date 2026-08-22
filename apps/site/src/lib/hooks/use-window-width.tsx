// Copyright © Todd Agriscience, Inc. All rights reserved.

import { useState, useEffect } from 'react';

/**
 * Helper hook for getting the width of the window. Resize updates are
 * debounced by 100ms (trailing edge) so `width` settles once per burst of
 * resize events. Returns `undefined` during SSR and the hydration render.
 *
 * For a binary breakpoint decision, prefer `useMediaQuery` — it only fires on
 * threshold crossings instead of every resize.
 *
 * @returns {number | undefined} - The width of the window
 */
export default function useWindowWidth() {
  const [width, setWidth] = useState<number>();

  useEffect(() => {
    let timeoutId: ReturnType<typeof setTimeout> | undefined;

    const handleResize = () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => setWidth(window.innerWidth), 100);
    };
    window.addEventListener('resize', handleResize);

    // Deferred to a frame so the initial measurement doesn't set state
    // synchronously inside the effect (react-hooks/set-state-in-effect).
    const frameId = requestAnimationFrame(() => setWidth(window.innerWidth));

    return () => {
      window.removeEventListener('resize', handleResize);
      clearTimeout(timeoutId);
      cancelAnimationFrame(frameId);
    };
  }, []);

  return width;
}
