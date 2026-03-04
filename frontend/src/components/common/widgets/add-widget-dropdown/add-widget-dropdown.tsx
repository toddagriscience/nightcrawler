// Copyright © Todd Agriscience, Inc. All rights reserved.

'use client';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { widgetEnum } from '@/lib/db/schema';
import { useRouter } from 'next/navigation';
import { createWidget } from '../actions';

export default function AddWidgetDropdown({
  managementZoneId,
  children,
  onWidgetAdded,
  onError,
  availableWidgets,
}: {
  managementZoneId: number;
  children: React.ReactNode;
  onWidgetAdded?: (widgetId: number, widgetType: string) => void;
  onError?: (error: string) => void;
  availableWidgets?: (typeof widgetEnum.enumValues)[number][];
}) {
  const router = useRouter();
  const widgetTypes = availableWidgets ?? widgetEnum.enumValues;

  const handleAddWidget = async (
    widgetType: (typeof widgetEnum.enumValues)[number]
  ) => {
    const result = await createWidget({
      managementZoneId,
      name: widgetType,
    });

    if (result.error) {
      onError?.(result.error);
    } else if (result.data) {
      onWidgetAdded?.(result.data.widgetId, widgetType);
      router.refresh();
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>{children}</DropdownMenuTrigger>
      <DropdownMenuContent className="bg-gradient-to-b from-[#ffffff] to-[#eaeaea]/90">
        <DropdownMenuLabel className="text-foreground/80 font-normal">
          Available Widgets
        </DropdownMenuLabel>
        <DropdownMenuSeparator className="mx-auto w-[90%] bg-foreground/30" />
        {widgetTypes.length > 0 ? (
          widgetTypes.map((widgetType) => (
            <DropdownMenuItem
              key={widgetType}
              className="hover:cursor-pointer"
              onClick={() => handleAddWidget(widgetType)}
            >
              {widgetType}
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
