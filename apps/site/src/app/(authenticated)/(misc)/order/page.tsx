// Copyright © Todd Agriscience, Inc. All rights reserved.

import { getAuthenticatedInfo } from '@/lib/utils/get-authenticated-info';
import { OrderClient } from './components/order-client';

/**
 * Authenticated order page backed by local storage on the client.
 */
export default async function OrderPage() {
  await getAuthenticatedInfo();

  // Open platform access; farm.approved still used for ApplicationReviewBanner
  // and internal tooling. Old guard after getAuthenticatedInfo():
  // if (!currentUser.approved) {
  //   notFound();
  // }

  return <OrderClient />;
}
