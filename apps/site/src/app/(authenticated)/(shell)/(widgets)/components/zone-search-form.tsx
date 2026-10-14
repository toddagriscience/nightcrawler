// Copyright © Todd Agriscience, Inc. All rights reserved.

'use client';

import { useSearchPanel } from '@/app/(authenticated)/components/search-panel/search-panel-context';
import { useState } from 'react';
import { IrisButton } from '../../../../../components/common/iris-button/iris-button';

/**
 * Zone-scoped search form. Opens the right-side search panel and runs an
 * inference search for the typed query, keeping the zone context on screen.
 *
 * @returns The search input and submit button
 */
export function ZoneSearchForm() {
  const { submitSearch } = useSearchPanel();
  const [query, setQuery] = useState('');

  return (
    <form
      role="search"
      className="mt-4 flex items-center gap-2"
      onSubmit={(event) => {
        event.preventDefault();
        const trimmed = query.trim();
        if (!trimmed) return;
        submitSearch(trimmed);
      }}
    >
      <input
        id="zone-search"
        name="q"
        type="search"
        value={query}
        onChange={(event) => setQuery(event.target.value)}
        placeholder="e.g. What does this mean for my tomatoes?"
        className="border-foreground/15 text-foreground flex-1 rounded-md border bg-transparent px-3 py-1.5 text-sm focus-visible:outline-none"
      />
      <IrisButton type="submit">Ask</IrisButton>
    </form>
  );
}
