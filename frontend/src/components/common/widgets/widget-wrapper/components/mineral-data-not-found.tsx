// Copyright © Todd Agriscience, Inc. All rights reserved.

import { WidgetSelect } from '@/lib/types/db';
import WidgetDeleteButton from './widget-delete-button';

/**
 * Fallback component displayed when no data is available for a mineral-level widget.
 *
 * @param name - The human-readable name of the mineral or metric (e.g. "calcium", "pH")
 */
export default function MineralDataNotFound({
  name,
  widget,
}: {
  name: string;
  widget: WidgetSelect;
}) {
  return (
    <div className="flex flex-row justify-between items-center">
      <p>No {name} data currently available</p>

      <WidgetDeleteButton widgetId={widget.id} />
    </div>
  );
}
