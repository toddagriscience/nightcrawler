// Copyright © Todd Agriscience, Inc. All rights reserved.

'use client';

import { WidgetSelect } from '@/lib/types/db';
import ReactGridLayout, { useContainerWidth } from 'react-grid-layout';

export default function WidgetsGrid({ widgets }: { widgets: WidgetSelect[] }) {
  const { width, containerRef, mounted } = useContainerWidth();

  const layout = [
    { i: 'a', x: 0, y: 0, w: 1, h: 4, static: true },
    { i: 'b', x: 1, y: 0, w: 3, h: 4, minW: 2, maxW: 4 },
    { i: 'c', x: 4, y: 0, w: 1, h: 2 },
  ];

  return (
    <div ref={containerRef} className="relative h-screen">
      {mounted && (
        <ReactGridLayout
          layout={layout}
          width={width}
          gridConfig={{ cols: 12, rowHeight: 30 }}
          className="h-screen!"
        >
          <div key="a" className="border border-solid border-black">
            a
          </div>
          <div key="b" className="border border-solid border-black">
            b
          </div>
          <div key="c" className="border border-solid border-black">
            c
          </div>
        </ReactGridLayout>
      )}
    </div>
  );
}
