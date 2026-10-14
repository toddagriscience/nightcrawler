// Copyright © Todd Agriscience, Inc. All rights reserved.

import { getGeneralImps } from './actions';
import { CatalogClient } from './components/catalog-client';
import { logger } from '@/lib/logger';
import { requireInternalAccount } from '@/lib/require-internal-account';

/** General practices are distinct from the farm-specific plans under /imps. */
export default async function GeneralImpsPage() {
  // Authorization stays outside error handling, so denied callers cannot render data.
  await requireInternalAccount();
  let imps;
  try {
    imps = await getGeneralImps();
  } catch (error) {
    logger.error('Failed to load general IMP catalog:', error);
  }
  if (!imps)
    return (
      <div role="alert">
        The general IMP catalog could not be loaded. Reload to try again.
      </div>
    );
  return <CatalogClient initialImps={imps} />;
}
