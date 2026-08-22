// Copyright © Todd Agriscience, Inc. All rights reserved.

import { useEffect, useState } from 'react';

/**
 * Tracks a CSS media query via matchMedia.
 *
 * Returns `undefined` during SSR and the hydration render (no window), then a
 * boolean that stays in sync with the query. Callers should treat `undefined`
 * as "render the static/mobile shell" so content is never withheld from the
 * server HTML.
 *
 * @param {string} query - The media query to track, e.g. '(min-width: 1024px)'
 * @returns {boolean | undefined} - Whether the query matches
 */
export default function useMediaQuery(query: string): boolean | undefined {
  const [matches, setMatches] = useState<boolean | undefined>(undefined);

  useEffect(() => {
    const mediaQueryList = window.matchMedia(query);
    const update = () => setMatches(mediaQueryList.matches);
    update();
    mediaQueryList.addEventListener('change', update);
    return () => mediaQueryList.removeEventListener('change', update);
  }, [query]);

  return matches;
}
