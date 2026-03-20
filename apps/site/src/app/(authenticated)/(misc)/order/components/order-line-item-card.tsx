// Copyright © Todd Agriscience, Inc. All rights reserved.

'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { formatPrice } from '@/lib/order/utils';
import type { OrderLineItemCardProps } from '../types';

/**
 * Renders a single order line item with quantity controls.
 *
 * @param {OrderLineItemCardProps} props - Order item display and interaction props.
 * @returns {JSX.Element} Order line item card.
 */
export function OrderLineItemCard({
  item,
  isCheckoutLocked,
  onUpdateQuantity,
  onRemoveItem,
}: OrderLineItemCardProps) {
  return (
    <article className="grid gap-4 rounded-3xl border border-stone-200 bg-white p-4 shadow-sm md:grid-cols-[8rem_minmax(0,1fr)_auto]">
      <Link
        href={`/product/${item.slug}`}
        className="relative block aspect-square overflow-hidden rounded-2xl bg-stone-100"
      >
        <Image
          src={item.imageUrl || '/seed-placeholder.svg'}
          alt={item.name}
          fill
          className="object-cover"
          sizes="128px"
        />
      </Link>

      <div className="space-y-2">
        <Link
          href={`/product/${item.slug}`}
          className="text-xl font-semibold text-foreground transition-opacity hover:opacity-70"
        >
          {item.name}
        </Link>
        <p className="text-sm text-foreground/70">{item.description}</p>
        <p className="text-sm font-medium text-foreground/70">
          {formatPrice(item.priceInCents)} / {item.unit}
        </p>
      </div>

      <div className="flex flex-col items-start gap-3 md:items-end">
        <div className="flex items-center gap-2">
          <Button
            type="button"
            variant="outline"
            size="icon"
            aria-label={`Decrease quantity of ${item.name}`}
            onClick={() => onUpdateQuantity(item.slug, item.quantity - 1)}
            disabled={isCheckoutLocked}
          >
            -
          </Button>
          <div className="min-w-12 text-center text-sm font-medium text-foreground">
            {item.quantity}
          </div>
          <Button
            type="button"
            variant="outline"
            size="icon"
            aria-label={`Increase quantity of ${item.name}`}
            onClick={() => onUpdateQuantity(item.slug, item.quantity + 1)}
            disabled={isCheckoutLocked}
          >
            +
          </Button>
        </div>
        <p className="text-sm font-medium text-foreground">
          {formatPrice(item.quantity * item.priceInCents)}
        </p>
        <Button
          type="button"
          variant="ghost"
          className="px-0 text-sm text-red-600 hover:bg-transparent hover:text-red-700"
          onClick={() => onRemoveItem(item.slug)}
          disabled={isCheckoutLocked}
        >
          Remove
        </Button>
      </div>
    </article>
  );
}
