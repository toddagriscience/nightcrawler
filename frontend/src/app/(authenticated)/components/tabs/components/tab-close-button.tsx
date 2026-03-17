// Copyright © Todd Agriscience, Inc. All rights reserved.

'use client';

import { Spinner } from '@/components/ui/spinner';
import { cn } from '@/lib/utils';
import type { MouseEvent } from 'react';
import { BiX } from 'react-icons/bi';
import { useTransition } from 'react';

/** Renders the close control for an individual tab and swaps the icon for a spinner while deletion is in flight. */
export default function TabCloseButton({
  onClose,
  tabName,
  visible,
}: {
  onClose: () => Promise<void>;
  tabName: string;
  visible: boolean;
}) {
  const [pending, startTransition] = useTransition();

  function handleClick(event: MouseEvent<HTMLButtonElement>) {
    event.preventDefault();
    event.stopPropagation();

    startTransition(async () => {
      await onClose();
    });
  }

  return (
    <button
      type="button"
      aria-label={`Close ${tabName}`}
      aria-busy={pending}
      disabled={pending}
      onClick={handleClick}
      className={cn(
        'hover:bg-foreground/10 hover:cursor-pointer absolute top-1/2 right-1 z-10 flex -translate-y-1/2 rounded-sm p-0.5 transition-opacity',
        visible ? 'opacity-100' : 'opacity-0 group-hover:opacity-100',
        pending ? 'opacity-100' : null
      )}
    >
      {pending ? (
        <Spinner className="text-foreground/50 size-4" />
      ) : (
        <BiX className="text-foreground/40 hover:text-foreground/60 size-5" />
      )}
    </button>
  );
}
