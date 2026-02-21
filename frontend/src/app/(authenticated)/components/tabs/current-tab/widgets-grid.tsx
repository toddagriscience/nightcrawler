// Copyright © Todd Agriscience, Inc. All rights reserved.

'use client';

import { updateWidget } from '@/components/common/widgets/actions';
import {
  widgetColumns,
  widgetRowHeight,
  widgetSizing,
} from '@/components/common/widgets/sizing';
import { WidgetEnum, WidgetSelect } from '@/lib/types/db';
import ReactGridLayout, {
  Layout,
  LayoutItem,
  useContainerWidth,
} from 'react-grid-layout';
import { NamedTab } from '../types';
import { useRouter } from 'next/navigation';

export default function WidgetsGrid({
  widgets,
  currentTab,
  renderedWidgets,
}: {
  widgets: WidgetSelect[];
  currentTab: NamedTab;
  renderedWidgets: React.ReactNode;
}) {
  const { width, containerRef, mounted } = useContainerWidth();
  const router = useRouter();

  const savedPositions = new Map(
    widgets.map((w) => [
      w.widgetMetadata.i,
      { x: w.widgetMetadata.x, y: w.widgetMetadata.y },
    ])
  );

  const layout = widgets.map((widget) => {
    return { ...widget.widgetMetadata, ...widgetSizing[widget.name] };
  });

  async function handleDrop(
    layout: Layout,
    oldItem: LayoutItem | null,
    newItem: LayoutItem | null,
    placeholder: LayoutItem | null,
    event: Event,
    element?: HTMLElement
  ) {
    // Only save widgets whose positions actually changed.
    const changed = layout.filter((item) => {
      const saved = savedPositions.get(item.i);
      return !saved || saved.x !== item.x || saved.y !== item.y;
    });

    if (changed.length > 0) {
      await Promise.all(
        changed.map((item) => {
          const widgetName = item.i as WidgetEnum;
          return updateWidget(currentTab.managementZone, widgetName, {
            widgetMetadata: {
              i: widgetName,
              x: item.x,
              y: item.y,
            },
          });
        })
      );
      router.refresh();
    }
  }

  return (
    <div ref={containerRef} className="relative h-screen">
      {mounted && (
        <ReactGridLayout
          layout={layout}
          onDragStop={handleDrop}
          width={width}
          gridConfig={{ cols: widgetColumns, rowHeight: widgetRowHeight }}
          className="h-screen!"
        >
          {renderedWidgets}
        </ReactGridLayout>
      )}
    </div>
  );
}
