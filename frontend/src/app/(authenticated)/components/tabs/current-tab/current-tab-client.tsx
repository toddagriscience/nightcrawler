// Copyright © Todd Agriscience, Inc. All rights reserved.

'use client';

import AddWidgetDropdown from '@/components/common/widgets/add-widget-dropdown';
import { Button } from '@/components/ui/button';
import { widgetEnum } from '@/lib/db/schema';
import { WidgetSelect } from '@/lib/types/db';
import { Plus } from 'lucide-react';
import { useState } from 'react';
import { NamedTab } from '../types';
import WidgetsGrid from './widgets-grid';

export default function CurrentTabClient({
  currentTab,
  widgets,
  unusedWidgets,
  renderedWidgets,
}: {
  currentTab: NamedTab;
  widgets: WidgetSelect[];
  unusedWidgets: (typeof widgetEnum.enumValues)[number][];
  renderedWidgets: React.ReactNode;
}) {
  const [showDotGrid, setShowDotGrid] = useState(false);

  const addWidgetButton = (
    <Button
      size="sm"
      variant="outline"
      className={
        widgets.length === 0
          ? 'hover:cursor-pointer'
          : 'ml-2 hover:cursor-pointer'
      }
    >
      Customize
      <Plus className="mr-2 h-4 w-4" />
    </Button>
  );

  if (widgets.length === 0) {
    return (
      <div className="relative flex h-[calc(100vh-100px)] flex-1 flex-col items-center justify-center gap-4">
        {showDotGrid && (
          <div
            aria-hidden="true"
            data-testid="tab-dot-grid-overlay"
            className="platform-dot-grid pointer-events-none absolute inset-0 z-0 opacity-45"
          />
        )}
        <h2 className="z-10 text-xl">Add a widget to get started</h2>
        <AddWidgetDropdown
          managementZoneId={currentTab.managementZone}
          availableWidgets={unusedWidgets}
          onOpenChange={setShowDotGrid}
          onWidgetSelected={() => setShowDotGrid(false)}
        >
          <div className="z-10">{addWidgetButton}</div>
        </AddWidgetDropdown>
      </div>
    );
  }

  return (
    <div>
      <AddWidgetDropdown
        managementZoneId={currentTab.managementZone}
        availableWidgets={unusedWidgets}
        onOpenChange={setShowDotGrid}
        onWidgetSelected={() => setShowDotGrid(false)}
      >
        {addWidgetButton}
      </AddWidgetDropdown>
      <WidgetsGrid
        widgets={widgets}
        currentTab={currentTab}
        renderedWidgets={renderedWidgets}
        showDotGrid={showDotGrid}
        onWidgetDragStart={() => setShowDotGrid(true)}
        onWidgetDragStop={() => setShowDotGrid(false)}
      />
    </div>
  );
}
