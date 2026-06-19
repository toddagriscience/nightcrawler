// Copyright © Todd Agriscience, Inc. All rights reserved.

import { formatPrice } from '@/lib/order/utils';
import type { VarietyStatus } from './types';

/** Badge label + Tailwind classes for a variety status. */
export function statusMeta(status: VarietyStatus): {
  label: string;
  className: string;
} {
  switch (status) {
    case 'available':
      return {
        label: 'In stock',
        className:
          'bg-green-50 text-green-700 ring-1 ring-inset ring-green-600/20',
      };
    case 'back_order':
      return {
        label: 'Back order',
        className:
          'bg-amber-50 text-amber-700 ring-1 ring-inset ring-amber-600/20',
      };
    case 'reference':
      return {
        label: 'Reference',
        className:
          'bg-stone-100 text-stone-600 ring-1 ring-inset ring-stone-500/20',
      };
  }
}

/** Lowest available unit price, formatted as "from $4.00 / oz", or null. */
export function priceFromLabel(variety: {
  pricePerOzCents: number | null;
  pricePerLbCents: number | null;
  pricePerPlantCents: number | null;
}): string | null {
  const options = [
    { cents: variety.pricePerOzCents, unit: 'oz' },
    { cents: variety.pricePerLbCents, unit: 'lb' },
    { cents: variety.pricePerPlantCents, unit: 'plant' },
  ].filter((o): o is { cents: number; unit: string } => o.cents != null);

  if (options.length === 0) return null;

  const cheapest = options.reduce((a, b) => (b.cents < a.cents ? b : a));
  return `from ${formatPrice(cheapest.cents)} / ${cheapest.unit}`;
}
