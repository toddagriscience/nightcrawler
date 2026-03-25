// Copyright © Todd Agriscience, Inc. All rights reserved.

import { getInternalAccounts } from './actions';
import InternalAccountsClient from './components/internal-accounts-client';

/**
 * Internal accounts management page (landing page).
 * Fetches initial data server-side and delegates interaction to the client component.
 */
export default async function InternalAccountsPage() {
  const initialAccounts = await getInternalAccounts();

  return <InternalAccountsClient initialAccounts={initialAccounts} />;
}
