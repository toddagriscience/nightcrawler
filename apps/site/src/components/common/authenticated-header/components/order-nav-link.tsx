// Copyright © Todd Agriscience, Inc. All rights reserved.

'use client';

import Link from 'next/link';
import { ShoppingCart } from 'lucide-react';
import { useOrder } from '@/lib/order/hooks';

/**
 * Order link shown in the authenticated navbar only when the local order has
 * one or more items.
 */
export function OrderNavLink() {
  const { itemCount } = useOrder();

  if (itemCount <= 0) {
    return null;
  }

  return (
    <Link
      href="/order"
      className="text-foreground inline-flex items-center gap-2 text-sm transition-opacity hover:opacity-70"
    >
      <ShoppingCart className="size-4" aria-hidden="true" />
      <span>Order</span>
      <span className="rounded-full bg-foreground/10 px-2 py-0.5 text-xs font-medium text-foreground/70">
        {itemCount}
      </span>
    </Link>
  );
}
