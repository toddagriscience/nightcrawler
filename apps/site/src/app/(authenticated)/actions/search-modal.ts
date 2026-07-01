// Copyright © Todd Agriscience, Inc. All rights reserved.

'use server';

import { getAllImps } from '@/lib/db/imps';
import { getAllSeedProducts } from '@/lib/db/seeds';
import { getAuthenticatedInfo } from '@/lib/utils/get-authenticated-info';

/**
 * Server action that loads the data backing the search modal: every IMP and
 * every seed product, fetched concurrently.
 *
 * Requires an authenticated user; `getAuthenticatedInfo` throws if the caller
 * is not authenticated, not found, or not associated with a farm.
 *
 * @returns An object with `imps` and `seeds` arrays for client-side filtering.
 */
export async function getSearchModalData() {
  await getAuthenticatedInfo();

  const [imps, seeds] = await Promise.all([getAllImps(), getAllSeedProducts()]);
  return { imps, seeds };
}
