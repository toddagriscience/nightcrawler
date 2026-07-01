// Copyright © Todd Agriscience, Inc. All rights reserved.

'use client';

import { useEffect, useRef, useState } from 'react';
import { LuSearch, LuSparkles } from 'react-icons/lu';
import { useSearchPanel } from './search-panel-context';

/**
 * Command-palette search popup. Opens from the sidebar Search action; pressing
 * Enter submits the query and opens the right-side inference results panel.
 *
 * @returns The search popup overlay, or null when closed
 */
export function SearchPopup() {
  const { modalOpen, closeModal, submitSearch } = useSearchPanel();
  const [query, setQuery] = useState('');
  const inputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (!modalOpen) return;
    inputRef.current?.focus();

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setQuery('');
        closeModal();
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [modalOpen, closeModal]);

  if (!modalOpen) return null;

  const trimmed = query.trim();
  const showSuggestion = trimmed.length > 0;

  function handleClose() {
    setQuery('');
    closeModal();
  }

  return (
    <div
      className="fixed inset-0 z-[60] flex items-start justify-center bg-black/20 pt-[20vh] backdrop-blur-[2px]"
      onClick={handleClose}
      role="presentation"
    >
      <div
        className="bg-background w-full max-w-xl overflow-hidden rounded-xl border border-[#D9D9D9]/40 shadow-2xl"
        onClick={(event) => event.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-label="Search"
      >
        <form
          onSubmit={(event) => {
            event.preventDefault();
            if (trimmed) {
              setQuery('');
              submitSearch(trimmed);
            }
          }}
        >
          <div className="flex items-center gap-3 border-b px-4 py-3">
            <LuSearch
              className="text-muted-foreground size-5 shrink-0"
              aria-hidden
            />
            <input
              ref={inputRef}
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Find..."
              className="text-foreground placeholder:text-muted-foreground flex-1 bg-transparent text-base outline-none"
              aria-label="Search query"
            />
            <button
              type="button"
              onClick={handleClose}
              className="text-muted-foreground shrink-0 rounded border border-[#D9D9D9]/60 px-1.5 py-0.5 text-[10px]"
            >
              Esc
            </button>
          </div>
        </form>

        {showSuggestion && (
          <ul className="max-h-80 overflow-y-auto py-1" role="listbox">
            <li role="option" aria-selected>
              <button
                type="button"
                onClick={() => {
                  setQuery('');
                  submitSearch(trimmed);
                }}
                className="hover:bg-accent flex w-full items-start gap-3 px-4 py-3 text-left transition-colors"
              >
                <LuSparkles
                  className="text-muted-foreground mt-0.5 size-4 shrink-0"
                  aria-hidden
                />
                <div className="min-w-0">
                  <p className="text-foreground truncate text-sm font-medium">
                    &ldquo;{trimmed}&rdquo;
                  </p>
                  <p className="text-muted-foreground mt-0.5 text-xs">
                    Navigation Assistant
                  </p>
                </div>
              </button>
            </li>
          </ul>
        )}
      </div>
    </div>
  );
}
