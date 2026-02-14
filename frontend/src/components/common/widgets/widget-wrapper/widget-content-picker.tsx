// Copyright © Todd Agriscience, Inc. All rights reserved.

import MineralLevelWidget from '../mineral-level-widget/mineral-level-widget';

export default function WidgetContentPicker({
  widgetName,
}: {
  widgetName: string;
}) {
  switch (widgetName) {
    case 'Macro Radar':
      return <p>Macro Radar Widget - Coming Soon</p>;

    case 'Calcium Widget':
      return (
        <>
          <h3 className="mb-2 text-lg font-semibold">Calcium Widget</h3>
          <MineralLevelWidget />
        </>
      );

    default:
      return (
        <>
          <h3 className="mb-2 text-lg font-semibold">Unknown Widget</h3>
          <div className="flex h-full items-center justify-center text-muted-foreground">
            Widget type &quot;{widgetName}&quot; not found
          </div>
        </>
      );
  }
}
