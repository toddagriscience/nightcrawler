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

  return (
    <div className="mt-15 rounded-lg border bg-white p-2 shadow-md">
      <p className="text-sm font-medium">
        {firstItem.date.toLocaleDateString()}
      </p>
      <p className="text-muted-foreground text-sm">
        {firstItem.x} {firstItem.unit}
      </p>
    </div>
  );
}
