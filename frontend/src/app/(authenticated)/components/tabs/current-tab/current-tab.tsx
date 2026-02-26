// Copyright © Todd Agriscience, Inc. All rights reserved.

import WidgetWrapper from '@/components/common/widgets/widget-wrapper';
import { widget, widgetEnum } from '@/lib/db/schema';
import { db } from '@/lib/db/schema/connection';
import { eq } from 'drizzle-orm';
import { NamedTab } from '../types';
import CurrentTabClient from './current-tab-client';

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

  return (
    <CurrentTabClient
      currentTab={currentTab}
      widgets={widgets}
      unusedWidgets={unusedWidgets}
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
  );
}
