// Copyright © Todd Agriscience, Inc. All rights reserved.

import { OrderClient } from './components/order-client';

/**
 * Authenticated order page backed by local storage on the client.
 */
export default async function OrderPage() {
  return <OrderClient />;
}
