// Copyright © Todd Agriscience, Inc. All rights reserved.

import WidgetWrapper from '@/components/common/widgets/widget-wrapper';
import { widget } from '@/lib/db/schema';
import { db } from '@/lib/db/schema/connection';
import { eq } from 'drizzle-orm';
import { NamedTab } from '../types';
import CurrentTabClient from './current-tab-client';

export default async function CurrentTab({
  currentTab,
  showDotGrid,
  onShowDotGrid,
  onHideDotGrid,
}: {
  currentTab: NamedTab;
  showDotGrid: boolean;
  onShowDotGrid: () => void;
  onHideDotGrid: () => void;
}) {
  const widgets = await db
    .select()
    .from(widget)
    .where(eq(widget.managementZone, currentTab.managementZone));

  return (
    <CurrentTabClient
      currentTab={currentTab}
      widgets={widgets}
      showDotGrid={showDotGrid}
      onShowDotGrid={onShowDotGrid}
      onHideDotGrid={onHideDotGrid}
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
