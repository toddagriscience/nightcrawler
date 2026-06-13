// Copyright © Todd Agriscience, Inc. All rights reserved.

import Link from 'next/link';

interface ZoneItemProps {
  id: number;
  name: string;
  /** Zero-based position; rendered as a 1-based keyboard badge. */
  index: number;
}

/**
 * Read-only management-zone row in the sidebar — links to the zone. No
 * create/delete controls.
 *
 * @param {ZoneItemProps} props - Zone id, display name, and list position
 * @returns {React.ReactNode} - The zone link row
 */
export default function ZoneItem({ id, name, index }: ZoneItemProps) {
  return (
    <div className="flex items-center gap-2 px-3 py-1.5 text-sm transition-colors text-foreground/70 hover:text-foreground">
      <Link
        href={`/?zone=${id}`}
        className="flex-1 flex items-center gap-2 min-w-0"
      >
        {name ? (
          <span className="size-2 shrink-0 rounded-full bg-green-500" />
        ) : (
          <span className="size-2 shrink-0" />
        )}
        <span className="min-w-0 flex-1 truncate">{name}</span>
        <kbd className="shrink-0 rounded bg-[#D9D9D9]/40 px-1.5 py-0.5 text-[10px] text-foreground/40">
          {index + 1}
        </kbd>
      </Link>
    </div>
  );
}
