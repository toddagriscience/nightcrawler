// Copyright © Todd Agriscience, Inc. All rights reserved.

'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { LuSearch } from 'react-icons/lu';
import IrisIcon from '../sidebar/iris-icon';
import { useSearchPanel } from './search-panel-context';
import { resultHref } from './search-display';
import {
  searchImps,
  type ImpHit,
} from '@/app/(authenticated)/actions/search-imps';

/**
 * Command-palette search popup. Keyword IMP matches appear as the user types
 * (each links to its detail page); the Navigation Assistant row runs the
 * semantic/inference search.
 *
 * @returns The search popup overlay, or null when closed
 */
export function SearchPopup() {
  const { modalOpen, closeModal, submitSearch } = useSearchPanel();
  const [query, setQuery] = useState('');
  const [hits, setHits] = useState<ImpHit[]>([]);
  const inputRef = useRef<HTMLInputElement | null>(null);

  // Bumped on every fired request so a slow, older response can't overwrite
  // the hits of a newer query (same pattern as search-panel-context).
  const requestIdRef = useRef(0);

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

  // Debounced keyword search over IMPs as the user types. All setState happens
  // inside the timeout (async), never synchronously in the effect body.
  useEffect(() => {
    const q = query.trim();
    const timer = setTimeout(() => {
      if (!q) {
        // Invalidate any in-flight request so it can't repopulate stale hits.
        requestIdRef.current += 1;
        setHits([]);
        return;
      }
      const requestId = requestIdRef.current + 1;
      requestIdRef.current = requestId;
      searchImps(q)
        .then((nextHits) => {
          if (requestId !== requestIdRef.current) return;
          setHits(nextHits);
        })
        .catch(() => {
          if (requestId !== requestIdRef.current) return;
          setHits([]);
        });
    }, 200);
    return () => clearTimeout(timer);
  }, [query]);

  if (!modalOpen) return null;

  const trimmed = query.trim();
  const showSuggestion = trimmed.length > 0;

  function handleClose() {
    setQuery('');
    setHits([]);
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
              setHits([]);
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
            {/* Keyword IMP matches → detail page */}
            {hits.map((hit) => (
              <li key={hit.id} role="option" aria-selected={false}>
                <Link
                  href={resultHref({
                    resultType: 'general-imp',
                    slug: hit.slug,
                  })}
                  onClick={handleClose}
                  className="hover:bg-accent flex w-full items-start gap-3 px-4 py-3 text-left transition-colors"
                >
                  <span className="text-muted-foreground mt-0.5 shrink-0">
                    <LuSearch className="size-4" aria-hidden />
                  </span>
                  <div className="min-w-0">
                    <p className="text-foreground truncate text-sm font-medium">
                      {hit.title}
                    </p>
                    <p className="text-muted-foreground mt-0.5 truncate text-xs">
                      {hit.snippet}
                    </p>
                  </div>
                </Link>
              </li>
            ))}

            {/* Navigation Assistant (semantic / inference) */}
            <li role="option" aria-selected={hits.length === 0}>
              <button
                type="button"
                onClick={() => {
                  setQuery('');
                  setHits([]);
                  submitSearch(trimmed);
                }}
                className="hover:bg-accent flex w-full items-start gap-3 px-4 py-3 text-left transition-colors"
              >
                <span className="mt-0.5 shrink-0">
                  <IrisIcon />
                </span>
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
