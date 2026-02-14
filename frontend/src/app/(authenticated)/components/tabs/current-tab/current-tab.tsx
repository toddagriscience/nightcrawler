// Copyright © Todd Agriscience, Inc. All rights reserved.

import { NamedTab } from '../types';
import WidgetsGrid from './widgets-grid';
import AddWidgetDropdown from '@/components/common/widgets/add-widget-dropdown';
import { Button } from '@/components/ui/button';
import { widget, widgetEnum } from '@/lib/db/schema';
import { db } from '@/lib/db/schema/connection';
import { Plus } from 'lucide-react';
import { eq } from 'drizzle-orm';

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
      <WidgetsGrid widgets={widgets} currentTab={currentTab} />
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
