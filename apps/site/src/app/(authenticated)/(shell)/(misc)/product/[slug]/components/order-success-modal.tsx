// Copyright © Todd Agriscience, Inc. All rights reserved.

'use client';

import Link from 'next/link';
import { CircleCheckBig } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import type { OrderSuccessModalProps } from '../types';

/**
 * Success modal shown after adding a seed product to the local order.
 */
export function OrderSuccessModal({
  isOpen,
  onOpenChange,
  productName,
}: OrderSuccessModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="gap-6 overflow-hidden rounded-3xl border-stone-200 p-0 shadow-2xl sm:max-w-xl">
        <div className="bg-gradient-to-br from-emerald-50 via-white to-stone-50 p-6 sm:p-8">
          <DialogHeader className="items-center text-center">
            <div
              className="mx-auto flex size-16 items-center justify-center rounded-full bg-emerald-100 text-emerald-700"
              aria-hidden="true"
            >
              <CircleCheckBig className="size-8" />
            </div>
            <DialogTitle className="text-2xl font-semibold text-foreground">
              Added to your order
            </DialogTitle>
            <DialogDescription className="max-w-md text-base leading-relaxed text-foreground/70">
              {productName} was added successfully. Review your order now or
              keep browsing for more products.
            </DialogDescription>
          </DialogHeader>

          <DialogFooter className="mt-8 flex-col gap-3 sm:flex-row sm:justify-center">
            <Button
              type="button"
              variant="outline"
              className="w-full sm:w-auto"
              onClick={() => onOpenChange(false)}
            >
              Continue shopping
            </Button>
            <Button asChild variant="brand" className="w-full sm:w-auto">
              <Link href="/order">View order</Link>
            </Button>
          </DialogFooter>
        </div>
      </DialogContent>
    </Dialog>
  );
}
