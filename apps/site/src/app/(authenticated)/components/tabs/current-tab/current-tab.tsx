// Copyright © Todd Agriscience, Inc. All rights reserved.

import { FadeIn } from '@/components/common';
import WidgetWrapper from '@/components/common/widgets/widget-wrapper';
import { widget } from '@nightcrawler/db/schema';
import { db } from '@nightcrawler/db/schema/connection';
import { eq } from 'drizzle-orm';
import { PiArrowBendUpLeft } from 'react-icons/pi';
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

  if (widgets.length === 0) {
    return (
      <div className="flex h-[calc(100vh-350px)] flex-1 flex-row items-center justify-center gap-2">
        <h2 className="text-3xl text-muted-foreground font-thin">
          Add a widget to get started
        </h2>
        <PiArrowBendUpLeft className="size-12 text-muted-foreground rotate-122 translate-y-[-10px]" />
      </div>
    );
  }

  return (
    <FadeIn className="flex h-full flex-col overflow-hidden">
      <div className="min-h-0 flex-1 mt-[-5px]">
        <WidgetsGrid
          widgets={widgets}
          currentTab={currentTab}
          renderedWidgets={widgets.map((widget) => {
            return (
              <div
                key={widget.widgetMetadata.i}
                className="h-full border border-[var(--border)] bg-[var(--background)] p-4"
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
