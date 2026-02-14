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

export default function WidgetsGrid({
  widgets,
  currentTab,
}: {
  widgets: WidgetSelect[];
  currentTab: NamedTab;
}) {
  const { width, containerRef, mounted } = useContainerWidth();

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
    if (newItem) {
      const widgetName = newItem.i as WidgetEnum;
      await updateWidget(currentTab.id, widgetName, {
        widgetMetadata: {
          i: widgetName,
          x: newItem.x,
          y: newItem.y,
        },
      });
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
          {widgets.map((widget) => {
            return (
              <div
                key={widget.widgetMetadata.i}
                className="border border-solid border-black"
              >
                {widget.name}
              </div>
            );
          })}
        </ReactGridLayout>
      )}
    </div>
  );
}
