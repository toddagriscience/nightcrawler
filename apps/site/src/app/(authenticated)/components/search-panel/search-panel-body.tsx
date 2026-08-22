// Copyright © Todd Agriscience, Inc. All rights reserved.

'use client';

/**
 * @fileoverview
 * Inner content of the right-side inference search panel. Loads semantic search
 * results for the active query and exposes a follow-up input at the bottom.
 */

import { useRef, useState } from 'react';
import { BiDockLeft, BiUpArrowAlt } from 'react-icons/bi';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { formatPrice } from '@/lib/order/utils';
import { useOrder } from '@/lib/order/hooks';
import Link from 'next/link';
import type { SearchResult } from '@/lib/ai/types';
import { useSearchPanel } from './search-panel-context';
import { previewText, resultHref } from './search-display';

/**
 * Renders the inference search results panel body.
 *
 * @returns The search results UI
 */
export function SearchPanelBody() {
  const {
    activeQuery,
    results,
    isSearching,
    searchError,
    collapsePanel,
    submitSearch,
  } = useSearchPanel();
  const [followUp, setFollowUp] = useState('');
  const [clearedForQuery, setClearedForQuery] = useState(activeQuery);
  const followUpRef = useRef<HTMLInputElement | null>(null);
  const { order, addItem, removeItem } = useOrder();

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
      <div className="flex items-center justify-end px-5 py-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={collapsePanel}
          aria-label="Collapse search results"
        >
          <BiDockLeft className="size-4" />
        </Button>
      </div>

      {/* Results */}
      <div className="flex-1 overflow-y-auto px-5 py-6">
        {activeQuery && (
          <div className="mb-6 flex justify-end">
            <p className="bg-stone-100 text-foreground max-w-[90%] rounded-[3px] px-4 py-3 text-sm leading-relaxed">
              {activeQuery}
            </p>
          </div>
        )}

        {isSearching && (
          <p className="text-muted-foreground text-sm">Searching…</p>
        )}

        {searchError && !isSearching && (
          <p role="alert" className="text-sm text-red-600">
            Something went wrong loading results. Please try again.
          </p>
        )}

        {!isSearching &&
          !searchError &&
          results.length === 0 &&
          activeQuery && (
            <p className="text-muted-foreground text-sm">
              No matching IMPs or products found. Try rephrasing your question.
            </p>
          )}

        {!isSearching && !searchError && results.length > 0 && (
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
                    {previewText(result.content, 320)}
                  </p>
                  <div className="mt-3 flex flex-wrap items-center gap-3">
                    <Link
                      href={resultHref(result)}
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
      <form onSubmit={handleFollowUpSubmit} className="px-4 py-3">
        <div className="flex items-center gap-2 rounded-xl border border-[#D9D9D9]/60 bg-white py-2 pr-2 pl-4">
          <Input
            ref={followUpRef}
            value={followUp}
            onChange={(event) => setFollowUp(event.target.value)}
            placeholder="Ask a follow up question..."
            className="flex-1 border-0 bg-transparent text-sm shadow-none focus-visible:ring-0"
            aria-label="Follow-up question"
          />
          <button
            type="submit"
            disabled={!followUp.trim()}
            aria-label="Submit follow-up question"
            className="text-foreground flex size-8 shrink-0 items-center justify-center rounded-md bg-stone-100 transition-colors hover:bg-stone-200 disabled:opacity-40"
          >
            <BiUpArrowAlt className="size-5" />
          </button>
        </div>
      </form>
    </div>
  );
}
