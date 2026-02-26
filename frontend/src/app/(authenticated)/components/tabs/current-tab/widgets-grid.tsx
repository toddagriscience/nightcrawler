// Copyright © Todd Agriscience, Inc. All rights reserved.

'use client';

import { updateWidget } from '@/components/common/widgets/actions';
import {
  widgetColumns,
  widgetRowHeight,
  widgetSizing,
} from '@/components/common/widgets/sizing';
import { WidgetEnum, WidgetSelect } from '@/lib/types/db';
import { useRouter } from 'next/navigation';
import ReactGridLayout, {
  Layout,
  LayoutItem,
  useContainerWidth,
} from 'react-grid-layout';
import { NamedTab } from '../types';

export default function WidgetsGrid({
  widgets,
  currentTab,
  renderedWidgets,
  showDotGrid,
  onWidgetDragStart,
  onWidgetDragStop,
}: {
  widgets: WidgetSelect[];
  currentTab: NamedTab;
  renderedWidgets: React.ReactNode;
  showDotGrid: boolean;
  onWidgetDragStart?: () => void;
  onWidgetDragStop?: () => void;
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
    onWidgetDragStop?.();

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
    <div ref={containerRef} className="relative h-[80vh]">
      {showDotGrid && (
        <div
          aria-hidden="true"
          data-testid="tab-dot-grid-overlay"
          className="platform-dot-grid pointer-events-none absolute inset-0 z-20 opacity-45"
        />
      )}
      {mounted && (
        <ReactGridLayout
          layout={layout}
          onDragStart={onWidgetDragStart}
          onDragStop={handleDrop}
          width={width}
          gridConfig={{ cols: widgetColumns, rowHeight: widgetRowHeight }}
          className="h-[80vh]!"
        >
          {renderedWidgets}
        </ReactGridLayout>
      )}
    </div>
  );
}
