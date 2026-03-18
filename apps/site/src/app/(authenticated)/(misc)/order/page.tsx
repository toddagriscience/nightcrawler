// Copyright © Todd Agriscience, Inc. All rights reserved.

import { notFound } from 'next/navigation';
import { getAuthenticatedInfo } from '@/lib/utils/get-authenticated-info';
import { OrderClient } from './components/order-client';

/**
 * Authenticated order page backed by local storage on the client.
 */
export default async function OrderPage() {
  const currentUser = await getAuthenticatedInfo();

  if (!currentUser.approved) {
    notFound();
  }

  return <OrderClient />;
}
