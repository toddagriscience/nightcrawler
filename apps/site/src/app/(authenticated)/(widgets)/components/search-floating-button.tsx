// Copyright © Todd Agriscience, Inc. All rights reserved.

'use client';

import { useState } from 'react';
import { LuSearch } from 'react-icons/lu';
import { Portal } from '@/components/common/portal';
import { SearchModal } from '@/components/common/search-modal/search-modal';

/**
 * Floating search trigger pinned to the bottom-right of the widgets view.
 * Opens the global search modal.
 *
 * @returns {React.ReactNode} - The floating search button
 */
export default function SearchFloatingButton() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label="Open search"
        className="fixed bottom-6 right-6 z-50 flex size-12 items-center justify-center rounded-full bg-foreground text-background shadow-lg transition-colors hover:opacity-90"
      >
        <LuSearch className="size-5" />
      </button>
      <Portal>
        <SearchModal isOpen={open} onClose={() => setOpen(false)} />
      </Portal>
    </>
  );
}
