// Copyright © Todd Agriscience, Inc. All rights reserved.

'use client';

import { useState } from 'react';
import { useSearchPanel } from '@/app/(authenticated)/components/search-panel/search-panel-context';

/**
 * Zone-scoped search form. Opens the right-side search panel seeded with the
 * typed query instead of navigating away, keeping the zone context on screen.
 *
 * @returns The search input and submit button
 */
export function ZoneSearchForm() {
  const { openPanel } = useSearchPanel();
  const [query, setQuery] = useState('');

  return (
    <form
      role="search"
      className="mt-4 flex gap-2"
      onSubmit={(event) => {
        event.preventDefault();
        openPanel(query.trim());
      }}
    >
      <input
        id="zone-search"
        name="q"
        type="search"
        value={query}
        onChange={(event) => setQuery(event.target.value)}
        placeholder="e.g. What does this mean for my tomatoes?"
        className="border-foreground/15 text-foreground flex-1 rounded-md border bg-transparent px-3 py-2 text-sm"
      />
      <button
        type="submit"
        className="border-foreground/15 text-foreground hover:bg-foreground/5 rounded-md border px-5 py-2 text-sm"
      >
        Ask
      </button>
    </form>
  );
}
