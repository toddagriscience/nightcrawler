// Copyright © Todd Agriscience, Inc. All rights reserved.

'use client';

/**
 * @fileoverview
 * Inner content of the right-side inference search panel. Loads semantic search
 * results for the active query and exposes a follow-up input at the bottom.
 */

import { useEffect, useRef, useState } from 'react';
import { LuChevronLeft, LuSearch } from 'react-icons/lu';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { runInferenceSearch } from '@/app/(authenticated)/actions/inference-search';
import { formatPrice } from '@/lib/order/utils';
import { useOrder } from '@/lib/order/hooks';
import Link from 'next/link';
import type { SearchResult } from '@/lib/ai/types';
import { useSearchPanel } from './search-panel-context';

/**
 * Renders the inference search results panel body.
 *
 * @returns The search results UI
 */
export function SearchPanelBody() {
  const {
    open,
    activeQuery,
    results,
    isSearching,
    collapsePanel,
    submitSearch,
    setSearchResults,
    setSearching,
  } = useSearchPanel();
  const [followUp, setFollowUp] = useState('');
  const [clearedForQuery, setClearedForQuery] = useState(activeQuery);
  const [loadError, setLoadError] = useState(false);
  const followUpRef = useRef<HTMLInputElement | null>(null);
  const { order, addItem, removeItem } = useOrder();

  // Run inference search whenever the active query changes while the panel is open.
  useEffect(() => {
    if (!open || !activeQuery || !isSearching) return;

    let cancelled = false;
    runInferenceSearch(activeQuery)
      .then((nextResults) => {
        if (cancelled) return;
        setLoadError(false);
        setSearchResults(activeQuery, nextResults);
      })
      .catch(() => {
        if (cancelled) return;
        setLoadError(true);
        setSearching(false);
      });

    return () => {
      cancelled = true;
    };
  }, [open, activeQuery, isSearching, setSearchResults, setSearching]);

  if (activeQuery !== clearedForQuery) {
    setClearedForQuery(activeQuery);
    setFollowUp('');
  }

  function handleFollowUpSubmit(event: React.FormEvent) {
    event.preventDefault();
    const trimmed = followUp.trim();
    if (!trimmed) return;
    setFollowUp('');
    submitSearch(trimmed);
  }

  function resultKey(result: SearchResult) {
    return `${result.resultType}-${result.id}`;
  }

  return (
    <div className="flex h-full flex-col bg-white">
      {/* Header */}
      <div className="flex items-center gap-3 border-b px-5 py-4">
        <LuSearch
          className="text-muted-foreground size-5 shrink-0"
          aria-hidden
        />
        <p className="text-foreground min-w-0 flex-1 text-sm font-medium">
          Search
        </p>
        <Button
          variant="ghost"
          size="icon"
          onClick={collapsePanel}
          aria-label="Collapse search results"
        >
          <LuChevronLeft className="size-4" />
        </Button>
      </div>

      {/* Results */}
      <div className="flex-1 overflow-y-auto px-5 py-6">
        {activeQuery && (
          <div className="mb-6 flex justify-end">
            <p className="bg-stone-100 text-foreground max-w-[90%] rounded-2xl rounded-tr-md px-4 py-3 text-sm leading-relaxed">
              {activeQuery}
            </p>
          </div>
        )}

        {isSearching && (
          <p className="text-muted-foreground text-sm">Searching…</p>
        )}

        {loadError && !isSearching && (
          <p role="alert" className="text-sm text-red-600">
            Something went wrong loading results. Please try again.
          </p>
        )}

        {!isSearching && !loadError && results.length === 0 && activeQuery && (
          <p className="text-muted-foreground text-sm">
            No matching IMPs or products found. Try rephrasing your question.
          </p>
        )}

        {!isSearching && !loadError && results.length > 0 && (
          <div className="space-y-6">
            {results.map((result) => {
              const key = resultKey(result);
              const isSeed = result.resultType === 'seed';
              const added =
                isSeed && order.items.some((item) => item.slug === result.slug);

              return (
                <article
                  key={key}
                  className="border-foreground/20 border-l-[3px] pl-4"
                >
                  <h3 className="text-sm font-semibold text-[#C45A1A]">
                    {result.title}
                  </h3>
                  <p className="text-foreground/80 mt-2 text-sm leading-relaxed">
                    {result.content?.slice(0, 320)}
                    {(result.content?.length ?? 0) > 320 ? '…' : ''}
                  </p>
                  <div className="mt-3 flex flex-wrap items-center gap-3">
                    <Link
                      href={
                        isSeed
                          ? `/product/${result.slug}`
                          : `/imp/${result.slug}`
                      }
                      className="text-foreground text-xs font-medium underline underline-offset-2 hover:opacity-70"
                      onClick={collapsePanel}
                    >
                      {isSeed ? 'View product' : 'View full IMP'}
                    </Link>
                    {isSeed && result.priceInCents != null && result.unit && (
                      <>
                        <span className="text-foreground text-xs font-semibold">
                          {formatPrice(result.priceInCents)}
                          <span className="text-muted-foreground font-normal">
                            /{result.unit}
                          </span>
                        </span>
                        <button
                          type="button"
                          aria-pressed={added}
                          onClick={() =>
                            added
                              ? removeItem(result.slug)
                              : addItem({
                                  seedProductId: result.id,
                                  slug: result.slug,
                                  name: result.title,
                                  description: result.content ?? '',
                                  stock: result.stock ?? 0,
                                  imageUrl: null,
                                  unit: result.unit ?? 'unit',
                                  priceInCents: result.priceInCents ?? 0,
                                })
                          }
                          className={`group rounded-full px-2 py-1 text-xs transition-colors ${
                            added
                              ? 'bg-foreground text-white hover:bg-red-600'
                              : 'bg-stone-100 text-foreground hover:bg-stone-200'
                          }`}
                        >
                          {added ? (
                            <>
                              <span className="group-hover:hidden">
                                Added ✓
                              </span>
                              <span className="hidden group-hover:inline">
                                Remove
                              </span>
                            </>
                          ) : (
                            'Add to order'
                          )}
                        </button>
                      </>
                    )}
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </div>

      {/* Follow-up search */}
      <form
        onSubmit={handleFollowUpSubmit}
        className="flex items-center gap-2 border-t bg-stone-50 px-4 py-3"
      >
        <LuSearch
          className="text-muted-foreground size-4 shrink-0"
          aria-hidden
        />
        <Input
          ref={followUpRef}
          value={followUp}
          onChange={(event) => setFollowUp(event.target.value)}
          placeholder="Ask a follow-up question…"
          className="flex-1 border-0 bg-transparent text-sm shadow-none focus-visible:ring-0"
          aria-label="Follow-up question"
        />
        <Button
          type="submit"
          size="sm"
          variant="secondary"
          disabled={!followUp.trim()}
        >
          Search
        </Button>
      </form>
    </div>
  );
}
