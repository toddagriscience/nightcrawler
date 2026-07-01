// Copyright © Todd Agriscience, Inc. All rights reserved.

'use client';

/**
 * @fileoverview
 * Inner content of the right-side search panel: a browse-and-search surface for
 * IMPs and seed products with an add-to-order toggle. Loads all IMPs/seeds when
 * the panel opens and filters them client-side as the user types. Unlike the
 * former modal, this is non-modal — it does not trap focus or block the page.
 */

import { useState, useEffect, useRef } from 'react';
import {
  LuBookOpen,
  LuSearch,
  LuShoppingCart,
  LuSprout,
  LuX,
} from 'react-icons/lu';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { getSearchModalData } from '@/app/(authenticated)/actions/search-modal';
import { formatPrice } from '@/lib/order/utils';
import { useOrder } from '@/lib/order/hooks';
import Link from 'next/link';
import { useSearchPanel } from './search-panel-context';

type Tab = 'imps' | 'seeds';

type SearchPanelData = Awaited<ReturnType<typeof getSearchModalData>>;
type Imp = SearchPanelData['imps'][number];
type Seed = SearchPanelData['seeds'][number];

/**
 * Renders the search panel body. Reads open/close state from
 * {@link useSearchPanel}; the surrounding {@link SearchPanel} owns positioning.
 *
 * @returns The browse-and-search UI
 */
export function SearchPanelBody() {
  const { open, closePanel } = useSearchPanel();
  const [query, setQuery] = useState('');
  const [activeTab, setActiveTab] = useState<Tab>('imps');
  const [imps, setImps] = useState<Imp[]>([]);
  const [seeds, setSeeds] = useState<Seed[]>([]);
  const [loadError, setLoadError] = useState(false);
  const [expandedImp, setExpandedImp] = useState<number | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const { order, itemCount, addItem, removeItem } = useOrder();

  // Load all IMPs/seeds each time the panel opens.
  useEffect(() => {
    if (!open) return;
    // Track whether this run is still current so a request that resolves after
    // the panel is closed/reopened cannot set stale data.
    let cancelled = false;
    getSearchModalData()
      .then(({ imps, seeds }) => {
        if (cancelled) return;
        setLoadError(false);
        setImps(imps);
        setSeeds(seeds);
      })
      .catch(() => {
        if (cancelled) return;
        setLoadError(true);
      });
    return () => {
      cancelled = true;
    };
  }, [open]);

  // Focus the search input when the panel opens.
  useEffect(() => {
    if (open) {
      inputRef.current?.focus();
    }
  }, [open]);

  // Escape closes the panel (non-trapping — the page stays interactive).
  useEffect(() => {
    if (!open) return;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        closePanel();
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [open, closePanel]);

  const filteredImps = imps.filter(
    (imp) =>
      imp.title.toLowerCase().includes(query.toLowerCase()) ||
      imp.category.toLowerCase().includes(query.toLowerCase())
  );

  const filteredSeeds = seeds.filter(
    (s) =>
      s.name.toLowerCase().includes(query.toLowerCase()) ||
      s.description?.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="flex h-full flex-col bg-white">
      {/* Header */}
      <div className="flex items-center gap-3 border-b px-5 py-4">
        <LuSearch className="text-muted-foreground size-5 shrink-0" />
        <Input
          ref={inputRef}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={
            activeTab === 'imps' ? 'Search IMPs...' : 'Search seeds...'
          }
          className="flex-1 border-0 text-base shadow-none focus:ring-0"
        />
        <Button
          variant="ghost"
          size="icon"
          onClick={closePanel}
          aria-label="Close search"
        >
          <LuX className="size-4" />
        </Button>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 border-b bg-stone-50 px-5 py-2">
        <button
          type="button"
          onClick={() => setActiveTab('imps')}
          className={`flex items-center gap-1.5 rounded-md px-3 py-1.5 text-sm transition-colors ${
            activeTab === 'imps'
              ? 'bg-white text-foreground shadow-sm'
              : 'text-muted-foreground hover:text-foreground'
          }`}
        >
          <LuBookOpen className="size-4" />
          Browse IMPs
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('seeds')}
          className={`flex items-center gap-1.5 rounded-md px-3 py-1.5 text-sm transition-colors ${
            activeTab === 'seeds'
              ? 'bg-white text-foreground shadow-sm'
              : 'text-muted-foreground hover:text-foreground'
          }`}
        >
          <LuSprout className="size-4" />
          Browse Seeds
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-5">
        {loadError && (
          <p role="alert" className="py-8 text-center text-sm text-red-600">
            Something went wrong loading results. Please try again.
          </p>
        )}
        {!loadError && activeTab === 'imps' && (
          <div className="space-y-3">
            {filteredImps.length === 0 ? (
              <p className="text-muted-foreground py-8 text-center">
                No IMPs found
              </p>
            ) : (
              filteredImps.map((imp) => (
                <div
                  key={imp.id}
                  className="overflow-hidden rounded-xl border border-stone-200"
                >
                  <div
                    className="flex cursor-pointer items-center justify-between gap-3 px-4 py-3 transition-colors hover:bg-stone-50"
                    onClick={() =>
                      setExpandedImp(expandedImp === imp.id ? null : imp.id)
                    }
                  >
                    <div className="min-w-0 flex-1">
                      <p className="text-foreground text-sm font-medium">
                        {imp.title}
                      </p>
                      <p className="text-muted-foreground mt-0.5 text-xs">
                        {imp.category}
                      </p>
                    </div>
                    <span className="shrink-0 rounded-full bg-emerald-100 px-2.5 py-0.5 text-xs font-medium text-emerald-700">
                      IMP
                    </span>
                  </div>
                  {expandedImp === imp.id && (
                    <div className="border-t bg-stone-50 px-4 pb-4">
                      <p className="text-muted-foreground mt-3 line-clamp-3 text-sm">
                        {imp.content?.slice(0, 300)}
                        {imp.content?.length > 300 ? '...' : ''}
                      </p>
                      <div className="mt-3 flex gap-2">
                        <Link
                          href={`/imp/${imp.slug}`}
                          className="text-foreground text-xs underline underline-offset-2 hover:opacity-70"
                          onClick={closePanel}
                        >
                          View full IMP
                        </Link>
                      </div>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        )}

        {!loadError && activeTab === 'seeds' && (
          <div className="grid grid-cols-2 gap-3">
            {filteredSeeds.length === 0 ? (
              <p className="text-muted-foreground col-span-2 py-8 text-center">
                No seeds found
              </p>
            ) : (
              filteredSeeds.map((seed) => {
                const added = order.items.some((i) => i.slug === seed.slug);
                return (
                  <div
                    key={seed.id}
                    className="overflow-hidden rounded-xl border border-stone-200"
                  >
                    <div className="p-3">
                      <p className="text-foreground truncate text-sm font-medium">
                        {seed.name}
                      </p>
                      <p className="text-muted-foreground mt-0.5 line-clamp-2 text-xs">
                        {seed.description}
                      </p>
                      <div className="mt-2 flex items-center justify-between">
                        <span className="text-foreground text-xs font-semibold">
                          {formatPrice(seed.priceInCents)}
                          <span className="text-muted-foreground text-xs font-normal">
                            /{seed.unit}
                          </span>
                        </span>
                        <button
                          type="button"
                          aria-pressed={added}
                          onClick={() =>
                            added
                              ? removeItem(seed.slug)
                              : addItem({
                                  seedProductId: seed.id,
                                  slug: seed.slug,
                                  name: seed.name,
                                  description: seed.description ?? '',
                                  stock: seed.stock,
                                  imageUrl: seed.imageUrl,
                                  unit: seed.unit,
                                  priceInCents: seed.priceInCents,
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
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        )}
      </div>

      {/* Footer with cart summary */}
      {itemCount > 0 && (
        <div className="flex items-center justify-between border-t bg-stone-50 px-5 py-3">
          <div className="text-muted-foreground flex items-center gap-2 text-sm">
            <LuShoppingCart className="size-4" />
            {itemCount} item{itemCount !== 1 ? 's' : ''} added to order
          </div>
          <Link
            href="/order"
            onClick={closePanel}
            className="text-foreground text-sm font-medium underline underline-offset-2 hover:opacity-70"
          >
            View order
          </Link>
        </div>
      )}
    </div>
  );
}
