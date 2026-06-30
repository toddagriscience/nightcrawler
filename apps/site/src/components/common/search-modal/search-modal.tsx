// Copyright © Todd Agriscience, Inc. All rights reserved.

'use client';

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

type Tab = 'imps' | 'seeds';

type SearchModalData = Awaited<ReturnType<typeof getSearchModalData>>;
type Imp = SearchModalData['imps'][number];
type Seed = SearchModalData['seeds'][number];

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

/**
 * Full-screen search modal for browsing IMPs and seed products.
 *
 * Loads all IMPs and seeds via a server action when opened, filters them
 * client-side as the user types, supports an add-to-order toggle for seeds,
 * and closes on Escape or backdrop click. The page behind the modal stays
 * scrollable while it is open.
 *
 * @param props - Component props.
 * @param props.isOpen - Whether the modal is currently visible.
 * @param props.onClose - Callback invoked when the modal should close.
 * @returns The rendered modal, or `null` when closed.
 */
export function SearchModal({ isOpen, onClose }: SearchModalProps) {
  const [query, setQuery] = useState('');
  const [activeTab, setActiveTab] = useState<Tab>('imps');
  const [imps, setImps] = useState<Imp[]>([]);
  const [seeds, setSeeds] = useState<Seed[]>([]);
  const [loadError, setLoadError] = useState(false);
  const [expandedImp, setExpandedImp] = useState<number | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const previouslyFocusedRef = useRef<HTMLElement | null>(null);
  const modalRef = useRef<HTMLDivElement | null>(null);
  const { order, itemCount, addItem, removeItem } = useOrder();

  useEffect(() => {
    if (!isOpen) return;
    // Track whether this effect run is still current so a request that
    // resolves after the modal is closed/reopened cannot set stale data.
    let cancelled = false;
    getSearchModalData()
      .then(({ imps, seeds }) => {
        if (cancelled) return;
        // Clear any stale error from a previous failed load on a fresh,
        // successful open so the result lists render correctly.
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
  }, [isOpen]);

  // Focus management: when the modal opens, remember the element that had
  // focus and move focus into the search input; when it closes (Escape,
  // backdrop click, or unmount), restore focus to that element.
  useEffect(() => {
    if (!isOpen) return;
    previouslyFocusedRef.current =
      document.activeElement instanceof HTMLElement
        ? document.activeElement
        : null;
    inputRef.current?.focus();
    return () => {
      previouslyFocusedRef.current?.focus();
    };
  }, [isOpen]);

  // Keyboard handling: Escape closes the modal, Tab/Shift+Tab keeps focus
  // trapped within the modal's focusable elements (WCAG 2.1 AA).
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
        return;
      }
      if (e.key !== 'Tab') return;

      const modal = modalRef.current;
      if (!modal) return;

      const focusable = modal.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled]), input:not([disabled]), textarea:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])'
      );
      if (focusable.length === 0) return;

      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      const active = document.activeElement;

      if (e.shiftKey) {
        if (active === first || !modal.contains(active)) {
          e.preventDefault();
          last.focus();
        }
      } else if (active === last || !modal.contains(active)) {
        e.preventDefault();
        first.focus();
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

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
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center isolate"
      role="dialog"
      aria-modal="true"
      aria-label="Search and browse"
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 z-[9998] bg-black/20"
        onClick={onClose}
      />

      {/* Modal */}
      <div
        ref={modalRef}
        className="relative z-[9999] w-full max-w-2xl mx-4 bg-white rounded-2xl shadow-2xl flex flex-col max-h-[80vh]"
      >
        {/* Header */}
        <div className="flex items-center gap-3 px-5 py-4 border-b">
          <LuSearch className="size-5 text-muted-foreground shrink-0" />
          <Input
            ref={inputRef}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={
              activeTab === 'imps' ? 'Search IMPs...' : 'Search seeds...'
            }
            className="flex-1 border-0 shadow-none text-base focus:ring-0"
          />
          <Button variant="ghost" size="icon" onClick={onClose}>
            <LuX className="size-4" />
          </Button>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 px-5 py-2 border-b bg-stone-50">
          <button
            type="button"
            onClick={() => setActiveTab('imps')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm transition-colors ${
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
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm transition-colors ${
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
            <p role="alert" className="text-center text-sm text-red-600 py-8">
              Something went wrong loading results. Please try again.
            </p>
          )}
          {!loadError && activeTab === 'imps' && (
            <div className="space-y-3">
              {filteredImps.length === 0 ? (
                <p className="text-center text-muted-foreground py-8">
                  No IMPs found
                </p>
              ) : (
                filteredImps.map((imp) => (
                  <div
                    key={imp.id}
                    className="rounded-xl border border-stone-200 overflow-hidden"
                  >
                    <div
                      className="flex items-center justify-between gap-3 px-4 py-3 cursor-pointer hover:bg-stone-50 transition-colors"
                      onClick={() =>
                        setExpandedImp(expandedImp === imp.id ? null : imp.id)
                      }
                    >
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-foreground text-sm">
                          {imp.title}
                        </p>
                        <p className="text-xs text-muted-foreground mt-0.5">
                          {imp.category}
                        </p>
                      </div>
                      <span className="rounded-full bg-emerald-100 px-2.5 py-0.5 text-xs font-medium text-emerald-700 shrink-0">
                        IMP
                      </span>
                    </div>
                    {expandedImp === imp.id && (
                      <div className="px-4 pb-4 border-t bg-stone-50">
                        <p className="text-sm text-muted-foreground mt-3 line-clamp-3">
                          {imp.content?.slice(0, 300)}
                          {imp.content?.length > 300 ? '...' : ''}
                        </p>
                        <div className="mt-3 flex gap-2">
                          <Link
                            href={`/imp/${imp.slug}`}
                            className="text-xs text-foreground underline underline-offset-2 hover:opacity-70"
                            onClick={onClose}
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
                <p className="col-span-2 text-center text-muted-foreground py-8">
                  No seeds found
                </p>
              ) : (
                filteredSeeds.map((seed) => {
                  const added = order.items.some((i) => i.slug === seed.slug);
                  return (
                    <div
                      key={seed.id}
                      className="rounded-xl border border-stone-200 overflow-hidden"
                    >
                      <div className="p-3">
                        <p className="font-medium text-foreground text-sm truncate">
                          {seed.name}
                        </p>
                        <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">
                          {seed.description}
                        </p>
                        <div className="flex items-center justify-between mt-2">
                          <span className="text-xs font-semibold text-foreground">
                            {formatPrice(seed.priceInCents)}
                            <span className="text-xs text-muted-foreground font-normal">
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
                            className={`group text-xs px-2 py-1 rounded-full transition-colors ${
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
          <div className="px-5 py-3 border-t bg-stone-50 flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <LuShoppingCart className="size-4" />
              {itemCount} item{itemCount !== 1 ? 's' : ''} added to order
            </div>
            <Link
              href="/order"
              onClick={onClose}
              className="text-sm font-medium text-foreground underline underline-offset-2 hover:opacity-70"
            >
              View order
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
