// Copyright © Todd Agriscience, Inc. All rights reserved.

import WidgetWrapper from '@/components/common/widgets/widget-wrapper';
import { widget } from '@/lib/db/schema';
import { db } from '@/lib/db/schema/connection';
import { eq } from 'drizzle-orm';
import { NamedTab } from '../types';
import WidgetsGrid from './widgets-grid';
import { FadeIn } from '@/components/common';

export default async function CurrentTab({
  currentTab,
}: {
  currentTab: NamedTab;
}) {
  const widgets = await db
    .select()
    .from(widget)
    .where(eq(widget.managementZone, currentTab.managementZone));

  if (widgets.length === 0) {
    return (
      <div className="flex h-[calc(100vh-100px)] flex-1 flex-col items-center justify-center gap-4">
        <h2 className="text-xl">Add a widget to get started</h2>
      </div>
    );
  }

  return (
    <FadeIn className="flex h-full flex-col overflow-hidden">
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
    </FadeIn>
  );
}
