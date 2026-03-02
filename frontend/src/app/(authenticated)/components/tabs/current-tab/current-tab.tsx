// Copyright © Todd Agriscience, Inc. All rights reserved.

import AddWidgetDropdown from '@/components/common/widgets/add-widget-dropdown';
import WidgetWrapper from '@/components/common/widgets/widget-wrapper';
import { Button } from '@/components/ui/button';
import { widget, widgetEnum } from '@/lib/db/schema';
import { db } from '@/lib/db/schema/connection';
import { eq } from 'drizzle-orm';
import { Plus } from 'lucide-react';
import { NamedTab } from '../types';
import WidgetsGrid from './widgets-grid';

export default async function CurrentTab({
  currentTab,
}: {
  currentTab: NamedTab;
}) {
  const widgets = await db
    .select()
    .from(widget)
    .where(eq(widget.managementZone, currentTab.managementZone));

  const allWidgetTypes = widgetEnum.enumValues;

  const existingWidgetNames = new Set(widgets.map((w) => w.name));
  const unusedWidgets = allWidgetTypes.filter(
    (widgetType) => !existingWidgetNames.has(widgetType)
  );

  if (widgets.length === 0) {
    return (
      <div className="flex h-[calc(100vh-100px)] flex-1 flex-col items-center justify-center gap-4">
        <h2 className="text-xl">Add a widget to get started</h2>
        <AddWidgetDropdown
          managementZoneId={currentTab.managementZone}
          availableWidgets={unusedWidgets}
        >
          <Button size="sm" variant="outline" className="hover:cursor-pointer">
            Customize
            <Plus className="mr-2 h-4 w-4" />
          </Button>
        </AddWidgetDropdown>
      </div>
    );
  }

  return (
    <div className="flex h-full flex-col overflow-hidden">
      <AddWidgetDropdown
        managementZoneId={currentTab.managementZone}
        availableWidgets={unusedWidgets}
      >
        <Button
          size="sm"
          variant="outline"
          className="ml-2 shrink-0 hover:cursor-pointer"
        >
          Customize
          <Plus className="mr-2 h-4 w-4" />
        </Button>
      </AddWidgetDropdown>
      <div className="min-h-0 flex-1">
        <WidgetsGrid
          widgets={widgets}
          currentTab={currentTab}
          renderedWidgets={widgets.map((widget) => {
            return (
              <div
                key={widget.widgetMetadata.i}
                className="h-full border bg-white p-4 shadow-sm"
              >
                <WidgetWrapper widget={widget} currentTab={currentTab} />
              </div>
            );
          })}
        />
      </div>
    </div>
  );
}
