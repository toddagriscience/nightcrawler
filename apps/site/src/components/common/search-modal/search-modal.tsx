// Copyright © Todd Agriscience, Inc. All rights reserved.

'use client';

import { useState, useEffect } from 'react';
import { Icon } from '@/components/common/icon/icon';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { getSearchModalData } from '@/app/(authenticated)/actions/search-modal';
import { formatPrice } from '@/lib/order/utils';
import Link from 'next/link';

type Tab = 'imps' | 'seeds';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

/**
 * Full-screen search modal for browsing IMPs and seed products.
 *
 * Loads all IMPs and seeds via a server action when opened, filters them
 * client-side as the user types, supports an add-to-order toggle for seeds,
 * closes on Escape or backdrop click, and locks body scroll while open.
 *
 * @param props - Component props.
 * @param props.isOpen - Whether the modal is currently visible.
 * @param props.onClose - Callback invoked when the modal should close.
 * @returns The rendered modal, or `null` when closed.
 */
export function SearchModal({ isOpen, onClose }: SearchModalProps) {
  const [query, setQuery] = useState('');
  const [activeTab, setActiveTab] = useState<Tab>('imps');
  const [imps, setImps] = useState<any[]>([]);
  const [seeds, setSeeds] = useState<any[]>([]);
  const [cartItems, setCartItems] = useState<Set<string>>(new Set());
  const [expandedImp, setExpandedImp] = useState<number | null>(null);

  useEffect(() => {
    if (isOpen) {
      getSearchModalData().then(({ imps, seeds }) => {
        setImps(imps);
        setSeeds(seeds);
      });
    }
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
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

  function toggleCartItem(id: string) {
    setCartItems((prev) => {
      const updated = new Set(prev);
      // eslint-disable-next-line drizzle/enforce-delete-with-where -- Set.delete, not a Drizzle query
      if (updated.has(id)) updated.delete(id);
      else updated.add(id);
      return updated;
    });
  }

  return (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center isolate"
      role="dialog"
      aria-modal="true"
      aria-label="Search and browse"
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 z-[9998] bg-black/60"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative z-[9999] w-full max-w-2xl mx-4 bg-white rounded-2xl shadow-2xl flex flex-col max-h-[80vh]">
        {/* Header */}
        <div className="flex items-center gap-3 px-5 py-4 border-b">
          <Icon
            src="/icons/search.svg"
            className="size-5 text-muted-foreground shrink-0"
          />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search IMPs and seeds..."
            className="flex-1 border-0 shadow-none text-base focus:ring-0"
            autoFocus
          />
          <Button variant="ghost" size="icon" onClick={onClose}>
            <Icon src="/icons/x.svg" className="size-4" />
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
            <Icon src="/icons/book-open.svg" className="size-4" />
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
            <Icon src="/icons/sprout.svg" className="size-4" />
            Browse Seeds
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-5">
          {activeTab === 'imps' && (
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

          {activeTab === 'seeds' && (
            <div className="grid grid-cols-2 gap-3">
              {filteredSeeds.length === 0 ? (
                <p className="col-span-2 text-center text-muted-foreground py-8">
                  No seeds found
                </p>
              ) : (
                filteredSeeds.map((seed) => (
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
                          onClick={() => toggleCartItem(seed.id)}
                          className={`text-xs px-2 py-1 rounded-full transition-colors ${
                            cartItems.has(seed.id)
                              ? 'bg-foreground text-white'
                              : 'bg-stone-100 text-foreground hover:bg-stone-200'
                          }`}
                        >
                          {cartItems.has(seed.id) ? 'Added' : 'Add to order'}
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>

        {/* Footer with cart summary */}
        {cartItems.size > 0 && (
          <div className="px-5 py-3 border-t bg-stone-50 flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Icon src="/icons/shopping-cart.svg" className="size-4" />
              {cartItems.size} item{cartItems.size !== 1 ? 's' : ''} added to
              order
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
