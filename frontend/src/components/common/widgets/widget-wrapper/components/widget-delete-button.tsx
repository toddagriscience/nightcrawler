// Copyright © Todd Agriscience, Inc. All rights reserved.

'use client';

import { Button } from '@/components/ui';
import { useRouter } from 'next/navigation';
import { BiX } from 'react-icons/bi';
import { deleteWidget } from '../../actions';

export default function WidgetDeleteButton({ widgetId }: { widgetId: number }) {
  const router = useRouter();

  async function handleDelete() {
    await deleteWidget(widgetId);
    router.refresh();
  }

  return (
    <Button
      onClick={handleDelete}
      className="p-0.5 hover:cursor-pointer hover:bg-[#D9D9D9]/32 h-auto rounded-md mr-[-5px] translate-y-[-8px] [&_svg]:size-5.5"
    >
      <BiX className="text-foreground/50 hover:text-foreground" />
    </Button>
  );
}
