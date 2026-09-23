// Copyright © Todd Agriscience, Inc. All rights reserved.

'use client';

import Link from 'next/link';
import { useSearchParams } from 'next/navigation';

interface ZoneItemProps {
  id: number;
  name: string;
  /** Zero-based position; rendered as a 1-based keyboard badge. */
  index: number;
  /** When true, shows a yellow dot marking the zone as pending review. */
  isPending?: boolean;
}

/**
 * Read-only management-zone row in the sidebar — links to the zone. No
 * create/delete controls.
 *
 * @param {ZoneItemProps} props - Zone id, display name, list position, and pending state
 * @returns {React.ReactNode} - The zone link row
 */
export default function ZoneItem({
  id,
  name,
  index,
  isPending = false,
}: ZoneItemProps) {
  const searchParams = useSearchParams();
  const isActive = searchParams.get('zone') === String(id);

  return (
    <Link
      href={`/?zone=${id}`}
      className={`
        flex items-center gap-2.5 px-3 py-2 rounded-md text-sm transition-colors w-full text-left
        ${
          isActive
            ? 'bg-accent/85 text-foreground font-semibold'
            : 'text-muted-foreground hover:bg-accent/60 hover:text-foreground'
        }
      `}
    >
      {isPending ? (
        <span
          className="size-2 shrink-0 rounded-full bg-yellow-500"
          role="img"
          aria-label="Pending review"
        />
      ) : null}
      <span className="min-w-0 flex-1 truncate">{name}</span>
      <kbd className="text-foreground/40 shrink-0 rounded bg-[#D9D9D9]/40 px-1.5 py-0.5 text-[10px]">
        Alt {index + 1}
      </kbd>
    </Link>
  );
}
