// Copyright © Todd Agriscience, Inc. All rights reserved.

'use client';

/**
 * @fileoverview
 * Right-side search panel container. A single responsive node:
 * - Desktop (`md+`): an in-flow, width-animated flex sibling that pushes the
 *   center content left while staying non-modal (the page remains interactive).
 * - Mobile: a fixed, slide-in overlay drawer with a dismiss backdrop, since
 *   shifting content is impractical on narrow screens.
 */

import { useSearchPanel } from './search-panel-context';
import { SearchPanelBody } from './search-panel-body';

/**
 * Renders the responsive search panel. Reads open state from
 * {@link useSearchPanel}.
 *
 * @returns The search panel and its mobile dismiss backdrop
 */
export function SearchPanel() {
  const { open, closePanel } = useSearchPanel();

  return (
    <>
      {/* Mobile-only dismiss backdrop (desktop is non-modal, no backdrop) */}
      <div
        aria-hidden="true"
        onClick={closePanel}
        className={`fixed inset-0 z-40 bg-black/20 transition-opacity md:hidden ${
          open ? 'opacity-100' : 'pointer-events-none opacity-0'
        }`}
      />

      {/*
        Mobile: fixed slide-in drawer (translate-x). Desktop: static in-flow
        panel whose width animates 0 -> 420px, shrinking the flex-1 content.
      */}
      <aside
        aria-label="Search"
        aria-hidden={!open}
        className={`
          fixed inset-y-0 right-0 z-50 flex h-screen w-full max-w-sm flex-col overflow-hidden
          border-l border-[#D9D9D9]/30 bg-white shadow-xl transition-transform duration-300 ease-in-out
          md:static md:z-auto md:max-w-none md:translate-x-0 md:shadow-none md:transition-[width]
          ${open ? 'translate-x-0 md:w-[420px]' : 'translate-x-full md:w-0'}
        `}
      >
        {/* Fixed inner width so text doesn't reflow during the desktop animation */}
        <div className="flex h-full w-full flex-col md:w-[420px]">
          <SearchPanelBody />
        </div>
      </aside>
    </>
  );
}
