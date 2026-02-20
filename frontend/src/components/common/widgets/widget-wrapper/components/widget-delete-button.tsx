// Copyright © Todd Agriscience, Inc. All rights reserved.

'use client';

import { Button } from '@/components/ui';
import { useRouter } from 'next/navigation';
import { deleteWidget } from '../../actions';

export default function WidgetDeleteButton({ widgetId }: { widgetId: number }) {
  const router = useRouter();

  async function handleDelete() {
    await deleteWidget(widgetId);
    router.refresh();
  }

  return (
    <Button onClick={handleDelete} className="p-0 hover:cursor-pointer h-min">
      X
    </Button>
  );
}
