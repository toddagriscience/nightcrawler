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
    .where(eq(widget.tab, currentTab.id));

  const allWidgetTypes = widgetEnum.enumValues;

  const existingWidgetNames = new Set(widgets.map((w) => w.name));
  const unusedWidgets = allWidgetTypes.filter(
    (widgetType) => !existingWidgetNames.has(widgetType)
  );

  return (
    <>
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
      <div className="absolute top-4 right-4">
        <AddWidgetDropdown
          tabId={currentTab.id}
          availableWidgets={unusedWidgets}
        >
          <Button size="sm" variant="outline">
            <Plus className="mr-2 h-4 w-4" />
            Add Widget
          </Button>
        </AddWidgetDropdown>
      </div>
    </>
  );
}
