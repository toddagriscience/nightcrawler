// Copyright © Todd Agriscience, Inc. All rights reserved.

'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { deleteManagementZone } from '@/app/(authenticated)/(accounts)/account/(with-shell)/management-zones/[zone]/actions';

interface ZoneItemProps {
  id: number;
  name: string;
  /** Zero-based position; rendered as a 1-based keyboard badge. */
  index: number;
  isActive?: boolean;
}

export default function ZoneItem({ id, name, index, isActive }: ZoneItemProps) {
  const router = useRouter();
  const [showConfirm, setShowConfirm] = useState(false);

  async function handleDelete(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    await deleteManagementZone(id);
    router.refresh();
    setShowConfirm(false);
  }

  if (showConfirm) {
    return (
      <div className="flex items-center gap-1 px-3 py-2 rounded-md bg-red-50 border border-red-200">
        <span className="flex-1 text-sm text-red-700 truncate">{name}</span>
        <button
          onClick={handleDelete}
          className="text-xs text-red-600 hover:text-red-800 font-medium px-1"
        >
          Delete
        </button>
        <button
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            setShowConfirm(false);
          }}
          className="text-xs text-muted-foreground hover:text-foreground px-1"
        >
          Cancel
        </button>
      </div>
    );
  }

  return (
    <div className="group flex items-center gap-2 px-3 py-1.5 text-sm cursor-pointer transition-colors text-foreground/70 hover:text-foreground">
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
      <button
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          setShowConfirm(true);
        }}
        className="opacity-0 group-hover:opacity-100 text-foreground/40 hover:text-red-500 transition-all p-0.5"
        aria-label={`Delete ${name}`}
      >
        <svg
          width="12"
          height="12"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M18 6L6 18M6 6l12 12" />
        </svg>
      </button>
    </div>
  );
}
