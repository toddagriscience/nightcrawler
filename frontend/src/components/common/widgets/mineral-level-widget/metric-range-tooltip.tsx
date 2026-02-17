// Copyright © Todd Agriscience, Inc. All rights reserved.

'use client';

import { TooltipProps } from 'recharts';
import {
  ValueType,
  NameType,
} from 'recharts/types/component/DefaultTooltipContent';
import { MineralChartType } from './types';

export default function MetricRangeTooltip({
  active,
  payload,
  label,
}: TooltipProps<ValueType, NameType>) {
  if (!active || !payload || payload.length === 0) {
    return null;
  }

  const firstItem = payload[0].payload as MineralChartType;
  const isAboveMax = firstItem.realValue > firstItem.x;
  const isBelowMin = firstItem.realValue < firstItem.x;

  return (
    <div className="mt-15 rounded-lg border bg-white p-2 shadow-md">
      <p className="text-sm font-medium">
        {firstItem.date.toLocaleDateString()}
      </p>
      <p className="text-muted-foreground text-sm">
        {firstItem.realValue} {firstItem.unit}
      </p>
      {isAboveMax && (
        <p className="mt-1 text-xs text-amber-600 font-medium">
          ⚠️ Value exceeds maximum
        </p>
      )}
      {isBelowMin && (
        <p className="mt-1 text-xs text-amber-600 font-medium">
          ⚠️ Value below minimum
        </p>
      )}
    </div>
  );
}
