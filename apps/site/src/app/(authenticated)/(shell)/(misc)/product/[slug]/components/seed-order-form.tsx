// Copyright © Todd Agriscience, Inc. All rights reserved.

'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useOrder } from '@/lib/order/hooks';
import type { SeedOrderFormProps, SeedOrderFormValues } from '../types';
import { OrderSuccessModal } from './order-success-modal';

/**
 * Client-side order form for adding a seed product to the local order.
 */
export function SeedOrderForm({
  seedProductId,
  slug,
  name,
  description,
  stock,
  imageUrl,
  unit,
  priceInCents,
}: SeedOrderFormProps) {
  const { addItem, order } = useOrder();
  /** Current quantity already stored in the local order for this product. */
  const currentOrderQuantity =
    order.items.find((item) => item.slug === slug)?.quantity ?? 0;
  /** Remaining quantity available beyond what is already in the local order. */
  const availableStock = Math.max(stock - currentOrderQuantity, 0);
  /** Whether the current product can be ordered. */
  const isOutOfStock = availableStock < 1;
  /** Whether the order success modal is currently visible. */
  const [isConfirmationOpen, setIsConfirmationOpen] = useState(false);
  const {
    register,
    handleSubmit,
    reset,
    setError,
    formState: { errors },
  } = useForm<SeedOrderFormValues>({
    defaultValues: {
      quantity: 1,
    },
  });

  /**
   * Adds the selected quantity to the local order and opens the success modal.
   *
   * @param {SeedOrderFormValues} values - The validated form values.
   * @returns {void}
   */
  function onSubmit(values: SeedOrderFormValues) {
    if (values.quantity > availableStock) {
      setError('quantity', {
        type: 'max',
        message: `Enter a quantity between 1 and ${availableStock}.`,
      });
      return;
    }

    addItem({
      seedProductId,
      slug,
      name,
      description,
      stock,
      imageUrl,
      unit,
      priceInCents,
      quantity: values.quantity,
    });
    reset({ quantity: Math.max(availableStock - values.quantity, 0) });
    setIsConfirmationOpen(true);
  }

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="space-y-2">
          <label
            htmlFor="seed-quantity"
            className="text-sm font-medium text-foreground"
          >
            Quantity
          </label>
          <Input
            id="seed-quantity"
            type="number"
            inputMode="numeric"
            min={1}
            max={Math.max(availableStock, 1)}
            disabled={isOutOfStock}
            {...register('quantity', {
              valueAsNumber: true,
              min: 1,
              validate: (quantity) =>
                quantity <= availableStock ||
                `Enter a quantity between 1 and ${availableStock}.`,
            })}
          />
          {errors.quantity && !isOutOfStock && (
            <p className="text-sm text-red-600">
              {errors.quantity.message ??
                `Enter a quantity between 1 and ${availableStock}.`}
            </p>
          )}
          {isOutOfStock && (
            <p className="text-sm text-amber-700">
              {stock > 0
                ? 'All available stock for this seed is already in your order.'
                : 'This seed is currently out of stock. Contact an advisor for timing.'}
            </p>
          )}
        </div>

        <Button
          type="submit"
          variant="brand"
          className="w-full"
          disabled={isOutOfStock}
        >
          {isOutOfStock ? 'Out of stock' : 'Order now'}
        </Button>
      </form>

      <OrderSuccessModal
        isOpen={isConfirmationOpen}
        onOpenChange={setIsConfirmationOpen}
        productName={name}
      />
    </>
  );
}
