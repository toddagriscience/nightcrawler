// Copyright © Todd Agriscience, Inc. All rights reserved.

'use client';

import { useEffect } from 'react';
import { useSearchPanel } from './search-panel-context';

/** Keeps global search scoped to the actual owned zone rendered by the dashboard. */
export function SearchZoneContext({ zoneId }: { zoneId: number }) {
  const { setCurrentZone } = useSearchPanel();
  useEffect(() => {
    setCurrentZone(zoneId);
    return () => setCurrentZone(undefined);
  }, [zoneId, setCurrentZone]);
  return null;
}
