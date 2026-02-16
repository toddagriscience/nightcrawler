// Copyright © Todd Agriscience, Inc. All rights reserved.

import { WidgetSelect } from '@/lib/types/db';
import WidgetContentPicker from './widget-content-picker';

export default async function WidgetWrapper({
  widget,
}: {
  widget: WidgetSelect;
}) {
  return (
    <div className="h-full border bg-white p-4 shadow-sm">
      <WidgetContentPicker widget={widget} />
    </div>
  );
}
