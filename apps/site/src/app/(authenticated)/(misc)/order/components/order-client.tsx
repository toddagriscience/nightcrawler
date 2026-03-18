// Copyright © Todd Agriscience, Inc. All rights reserved.

'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useOrder } from '@/lib/order/hooks';
import { formatPrice } from '@/lib/order/utils';
import type { CheckoutFormValues } from '../types';

/**
 * Client order page that renders the local-storage-backed shopping cart.
 */
export function OrderClient() {
  const { order, itemCount, subtotal, updateQuantity, removeItem, clear } =
    useOrder();
  const {
    register,
    handleSubmit,
    reset,
    formState: { isSubmitSuccessful },
  } = useForm<CheckoutFormValues>({
    defaultValues: {
      cardholderName: '',
      cardNumber: '',
      expiration: '',
      cvv: '',
    },
  });

  function onSubmit() {
    reset();
  }

  if (order.items.length === 0) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-16 text-center">
        <h1 className="text-3xl font-semibold text-foreground">
          Your order is empty
        </h1>
        <p className="mt-3 text-foreground/70">
          Add seed products from search or a product detail page to start an
          order.
        </p>
        <Button asChild variant="brand" className="mt-6">
          <Link href="/search">Browse products</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 md:px-6">
      <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_22rem]">
        <section className="space-y-4">
          <div>
            <h1 className="text-3xl font-semibold text-foreground">Order</h1>
            <p className="mt-2 text-foreground/70">
              Review your selected seed products before checkout.
            </p>
          </div>

          {order.items.map((item) => (
            <article
              key={item.slug}
              className="grid gap-4 rounded-3xl border border-stone-200 bg-white p-4 shadow-sm md:grid-cols-[8rem_minmax(0,1fr)_auto]"
            >
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
                    onClick={() => updateQuantity(item.slug, item.quantity - 1)}
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
                    onClick={() => updateQuantity(item.slug, item.quantity + 1)}
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
                  onClick={() => removeItem(item.slug)}
                >
                  Remove
                </Button>
              </div>
            </article>
          ))}
        </section>

        <aside className="h-max rounded-3xl border border-stone-200 bg-white p-6 shadow-sm">
          <div className="space-y-4">
            <div className="flex items-center justify-between text-sm text-foreground/70">
              <span>Items</span>
              <span>{itemCount}</span>
            </div>
            <div className="flex items-center justify-between text-lg font-semibold text-foreground">
              <span>Subtotal</span>
              <span>{formatPrice(subtotal)}</span>
            </div>
            <p className="text-sm text-foreground/60">
              Taxes, shipping, and final fulfillment are not calculated yet.
            </p>

            <Dialog>
              <DialogTrigger asChild>
                <Button variant="brand" className="w-full">
                  Checkout
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Checkout</DialogTitle>
                  <DialogDescription>
                    Confirm your order details below. Payment information is
                    used only for this placeholder form and is never stored.
                  </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                  <Input
                    placeholder="Cardholder name"
                    {...register('cardholderName')}
                  />
                  <Input
                    placeholder="Card number"
                    {...register('cardNumber')}
                  />
                  <div className="grid grid-cols-2 gap-3">
                    <Input placeholder="MM/YY" {...register('expiration')} />
                    <Input placeholder="CVV" {...register('cvv')} />
                  </div>

                  {isSubmitSuccessful && (
                    <p className="text-sm text-amber-700">
                      Order placement is not implemented yet. No payment details
                      were stored.
                    </p>
                  )}

                  <DialogFooter>
                    <Button type="submit" variant="brand">
                      Place order
                    </Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>

            <Button
              type="button"
              variant="outline"
              className="w-full"
              onClick={clear}
            >
              Clear order
            </Button>
          </div>
        </aside>
      </div>
    </div>
  );
}
