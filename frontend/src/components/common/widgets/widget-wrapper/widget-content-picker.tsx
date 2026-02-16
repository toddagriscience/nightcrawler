// Copyright © Todd Agriscience, Inc. All rights reserved.

import { WidgetSelect } from '@/lib/types/db';
import MineralLevelWidget from '../mineral-level-widget/mineral-level-widget';

export default function WidgetContentPicker({
  widget,
  closeButton,
}: {
  widget: WidgetSelect;
  closeButton: React.ReactNode;
}) {
  switch (widget.name) {
    case 'Macro Radar':
      return <p>Macro Radar Widget - Coming Soon</p>;

    case 'Calcium Widget':
      const title = 'Calcium';
      const lastUpdated = 'August 2025';

      return (
        <>
          <div className="flex flex-row justify-between">
            <h2>{title}</h2>
            <p>Last Updated {lastUpdated}</p>
            {closeButton}
          </div>

          <MineralLevelWidget>
            <div className="col-start-1 row-start-1 flex h-full w-full flex-row gap-1">
              <div
                className={`flex h-5 basis-1/3 items-center justify-center rounded-xl bg-yellow-500/30`}
              >
                <p className="mx-auto mb-[2px] max-h-full text-center text-sm font-light text-black/90">
                  Low
                </p>
              </div>
              <div className={`h-5 basis-1/3 rounded-xl bg-green-500/30`}>
                <p className="mx-auto mb-[2px] max-h-full text-center text-sm font-light text-black/70">
                  Ideal
                </p>
              </div>
              <div className={`h-5 basis-1/3 rounded-xl bg-yellow-500/30`}>
                <p className="mx-auto mb-[2px] max-h-full text-center text-sm font-light text-black/90">
                  High
                </p>
              </div>
            </div>
          </MineralLevelWidget>
        </>
      );

    default:
      return (
        <>
          <h3 className="mb-2 text-lg font-semibold">Unknown Widget</h3>
          <div className="text-muted-foreground flex h-full items-center justify-center">
            Widget type &quot;{widget.name}&quot; not found
          </div>
        </>
      );
  }
}
