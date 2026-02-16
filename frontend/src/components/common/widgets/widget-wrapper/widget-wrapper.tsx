// Copyright © Todd Agriscience, Inc. All rights reserved.

'use client';

import { WidgetSelect } from '@/lib/types/db';
import { Button } from '@/components/ui';
import { useRouter } from 'next/navigation';
import { deleteWidget } from '../actions';
import WidgetContentPicker from './widget-content-picker';

export default function WidgetWrapper({ widget }: { widget: WidgetSelect }) {
  const router = useRouter();

  async function handleDelete(widgetId: number) {
    await deleteWidget(widgetId);
    router.refresh();
  }

  return (
    <div className="h-full border bg-white p-4 shadow-sm">
      <WidgetContentPicker
        widget={widget}
        closeButton={
          <Button
            onClick={() => handleDelete(widget.id)}
            className="hover:cursor-pointer"
          >
            X
          </Button>
        }
      />
    </div>
  );
}
