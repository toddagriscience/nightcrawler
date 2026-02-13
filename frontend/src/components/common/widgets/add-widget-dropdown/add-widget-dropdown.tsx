// Copyright © Todd Agriscience, Inc. All rights reserved.

'use client';

import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
} from '@/components/ui/dropdown-menu';
import { createWidget } from '../actions';
import { widgetEnum } from '@/lib/db/schema';

export default function AddWidgetDropdown({
  tabId,
  children,
  onWidgetAdded,
  onError,
  availableWidgets,
}: {
  tabId: number;
  children: React.ReactNode;
  onWidgetAdded?: (widgetId: number, widgetType: string) => void;
  onError?: (error: string) => void;
  availableWidgets?: (typeof widgetEnum.enumValues)[number][];
}) {
  const widgetTypes = availableWidgets ?? widgetEnum.enumValues;

  const handleAddWidget = async (
    widgetType: (typeof widgetEnum.enumValues)[number]
  ) => {
    const result = await createWidget({
      tabId,
      name: widgetType,
    });

    if (result.error) {
      onError?.(result.error);
    } else if (result.data) {
      onWidgetAdded?.(result.data.widgetId, widgetType);
    }
  };

  const formatWidgetName = (name: string) => {
    return name
      .replace(/([A-Z])/g, ' $1')
      .replace(/^./, (str) => str.toUpperCase())
      .trim();
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>{children}</DropdownMenuTrigger>
      <DropdownMenuContent className="bg-white">
        <DropdownMenuLabel>Add Widget</DropdownMenuLabel>
        {widgetTypes.length > 0 ? (
          widgetTypes.map((widgetType) => (
            <DropdownMenuItem
              key={widgetType}
              className="hover:cursor-pointer"
              onClick={() => handleAddWidget(widgetType)}
            >
              {formatWidgetName(widgetType)}
            </DropdownMenuItem>
          ))
        ) : (
          <DropdownMenuLabel className="font-normal">
            No widgets available
          </DropdownMenuLabel>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
