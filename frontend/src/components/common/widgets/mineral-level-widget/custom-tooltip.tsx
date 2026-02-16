// Copyright © Todd Agriscience, Inc. All rights reserved.

import { TooltipProps } from 'recharts';
import {
  ValueType,
  NameType,
} from 'recharts/types/component/DefaultTooltipContent';

export default function CustomTooltip({
  active,
  payload,
  label,
}: TooltipProps<ValueType, NameType>) {
  if (!active || !payload || payload.length === 0) {
    return null;
  }

  const firstItem = payload[0];

  return (
    <div className="rounded-lg border bg-white p-2 shadow-md">
      <p className="text-sm font-medium">
        {label ? `${label}` : firstItem.name || 'Value'}
      </p>
      <p className="text-sm text-muted-foreground">Value: {firstItem.value}%</p>
    </div>
  );
}
