// Copyright © Todd Agriscience, Inc. All rights reserved.

import { TabSelect } from '@/lib/types/db';
import { getTabHash } from '../components/tabs/utils';
import { NamedTab } from '../components/tabs/types';

/** Returns the hash (given by getTabHash()) of the currently selected tab. */
export async function getSelectedTabHash(
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>,
  currentTabs: TabSelect[]
) {
  const tabParam = (await searchParams).tab;

  const requestedTabHash = typeof tabParam === 'string' ? tabParam : undefined;

  // If the user doesn't have a tab open or selected, set the tab.
  const hasTabInDb = currentTabs.some(
    (tab) => String(tab.id) === requestedTabHash
  );
  return requestedTabHash && hasTabInDb
    ? requestedTabHash
    : currentTabs[0]
      ? getTabHash({ ...currentTabs[0], name: null })
      : 'home';
}

/** Gets the actual NamedTab given a tab hash. O(n), but it doesn't really matter. */
export async function getSelectedTab(tabHash: string, currentTabs: NamedTab[]) {
  return (
    currentTabs.find((tab) => getTabHash(tab) === tabHash) || currentTabs[0]
  );
}
