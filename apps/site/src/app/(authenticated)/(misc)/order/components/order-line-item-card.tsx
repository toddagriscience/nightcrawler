// Copyright © Todd Agriscience, Inc. All rights reserved.

'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Minus, Plus, Trash2 } from 'lucide-react';
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
    <article className="group relative overflow-hidden rounded-2xl border border-stone-200 bg-white p-5 shadow-sm transition-all duration-300 hover:border-stone-300 hover:shadow-md md:p-6">
      <div className="grid gap-5 md:grid-cols-[7rem_minmax(0,1fr)_auto] md:items-start">
        {/* Product Image */}
        <Link
          href={`/product/${item.slug}`}
          className="relative block aspect-square overflow-hidden rounded-xl bg-stone-100 ring-1 ring-stone-200/50 transition-all duration-300 group-hover:ring-stone-300/70"
        >
          <Image
            src={item.imageUrl || '/seed-placeholder.svg'}
            alt={item.name}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            sizes="112px"
          />
        </Link>

        {/* Product Info */}
        <div className="flex flex-col gap-1.5">
          <Link
            href={`/product/${item.slug}`}
            className="text-lg font-semibold text-foreground transition-colors duration-200 hover:text-foreground/70"
          >
            {item.name}
          </Link>
          <p className="line-clamp-1 text-sm leading-relaxed text-foreground/60">
            {item.description}
          </p>
          <p className="text-sm font-medium text-foreground/50">
            {formatPrice(item.priceInCents)}
            <span className="mx-1.5 text-foreground/30">·</span>
            {item.unit}
          </p>
        </div>

        {/* Quantity & Actions */}
        <div className="flex flex-col items-stretch gap-4 md:items-end md:justify-start">
          {/* Quantity Controls */}
          <div className="flex items-center gap-1 rounded-full border border-stone-200 bg-stone-50/50 p-1 ring-1 ring-stone-200/50">
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="size-8 rounded-full text-stone-500 transition-colors duration-200 hover:bg-white hover:text-foreground disabled:opacity-40"
              aria-label={`Decrease quantity of ${item.name}`}
              onClick={() => onUpdateQuantity(item.slug, item.quantity - 1)}
              disabled={isCheckoutLocked}
            >
              <Minus className="size-3.5" />
            </Button>
            <div className="min-w-[2.5rem] text-center text-sm font-semibold tabular-nums text-foreground">
              {item.quantity}
            </div>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="size-8 rounded-full text-stone-500 transition-colors duration-200 hover:bg-white hover:text-foreground disabled:opacity-40"
              aria-label={`Increase quantity of ${item.name}`}
              onClick={() => onUpdateQuantity(item.slug, item.quantity + 1)}
              disabled={isCheckoutLocked}
            >
              <Plus className="size-3.5" />
            </Button>
          </div>

          {/* Line Total */}
          <p className="text-base font-semibold text-foreground tabular-nums">
            {formatPrice(item.quantity * item.priceInCents)}
          </p>

          {/* Remove Button */}
          <Button
            type="button"
            variant="ghost"
            className="size-8 rounded-full p-0 text-stone-400 transition-colors duration-200 hover:bg-red-50 hover:text-red-600 disabled:opacity-40"
            onClick={() => onRemoveItem(item.slug)}
            disabled={isCheckoutLocked}
          >
            <Trash2 className="size-4" />
          </Button>
        </div>
      </div>
    </article>
  );
}
