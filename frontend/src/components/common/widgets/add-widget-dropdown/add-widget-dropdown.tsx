// Copyright © Todd Agriscience, Inc. All rights reserved.

'use client';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
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
      <DropdownMenuContent className="bg-white border-1 border-[#D9D9D9] w-55 translate-x-[63px]">
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
          <DropdownMenuLabel className="font-normal text-center text-foreground/90">
            No more widgets available
          </DropdownMenuLabel>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
