// Copyright © Todd Agriscience, Inc. All rights reserved.

'use client';

import { WidgetSelect } from '@/lib/types/db';
import { NamedTab } from '../types';
import { useWidgetGridOverlay } from './widget-grid-overlay-context';
import WidgetsGrid from './widgets-grid';

export default function CurrentTabClient({
  currentTab,
  widgets,
  renderedWidgets,
}: {
  currentTab: NamedTab;
  widgets: WidgetSelect[];
  renderedWidgets: React.ReactNode;
}) {
  const { showDotGrid, setShowDotGrid } = useWidgetGridOverlay();

  if (widgets.length === 0) {
    return (
      <div className="relative flex h-full flex-1 flex-col items-center justify-center gap-4 overflow-hidden">
        {showDotGrid && (
          <div
            aria-hidden="true"
            data-testid="tab-dot-grid-overlay"
            className="platform-dot-grid pointer-events-none absolute inset-0 z-0 opacity-45"
          />
        )}
        <h2 className="z-10 text-xl">Add a widget to get started</h2>
      </div>
    );
  }

  return (
    <div className="h-full overflow-hidden">
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
