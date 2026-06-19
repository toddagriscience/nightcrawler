// Copyright © Todd Agriscience, Inc. All rights reserved.
'use client';

import Link from 'next/link';
import { useMemo, useState } from 'react';
import { priceFromLabel, statusMeta } from '../format';
import type { BrowseCropGroup, BrowseVariety, VarietyStatus } from '../types';

type StatusFilter = 'all' | VarietyStatus;
type View = 'list' | 'grid';

const STATUS_FILTERS: { value: StatusFilter; label: string }[] = [
  { value: 'all', label: 'All' },
  { value: 'available', label: 'In stock' },
  { value: 'back_order', label: 'Back order' },
  { value: 'reference', label: 'Reference' },
];

function StatusBadge({ status }: { status: VarietyStatus }) {
  const { label, className } = statusMeta(status);
  return (
    <span
      className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${className}`}
    >
      {label}
    </span>
  );
}

export function VarietyBrowse({ groups }: { groups: BrowseCropGroup[] }) {
  const [query, setQuery] = useState('');
  const [status, setStatus] = useState<StatusFilter>('all');
  const [view, setView] = useState<View>('list');

  const filteredGroups = useMemo(() => {
    const q = query.trim().toLowerCase();
    return groups
      .map((group) => ({
        ...group,
        varieties: group.varieties.filter((v) => {
          if (status !== 'all' && v.status !== status) return false;
          if (!q) return true;
          return (
            v.name.toLowerCase().includes(q) ||
            v.cropName.toLowerCase().includes(q) ||
            (v.description?.toLowerCase().includes(q) ?? false)
          );
        }),
      }))
      .filter((group) => group.varieties.length > 0);
  }, [groups, query, status]);

  const total = useMemo(
    () => filteredGroups.reduce((n, g) => n + g.varieties.length, 0),
    [filteredGroups]
  );

  return (
    <div className="mx-auto max-w-4xl px-4 py-10 md:px-6">
      <header>
        <h1 className="text-3xl font-semibold tracking-tight text-foreground">
          Varieties
        </h1>
        <p className="mt-1 text-foreground/60">
          Browse Todd&apos;s seed inventory
        </p>
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search varieties…"
          className="mt-5 w-full rounded-lg border border-stone-200 bg-stone-50 px-4 py-2.5 text-sm outline-none transition-colors focus:border-stone-300 focus:bg-white"
        />
      </header>

      <div className="mt-5 flex flex-wrap items-center gap-2">
        {STATUS_FILTERS.map((f) => (
          <button
            key={f.value}
            type="button"
            onClick={() => setStatus(f.value)}
            className={`rounded-full border px-3 py-1 text-sm transition-colors ${
              status === f.value
                ? 'border-foreground bg-foreground text-background'
                : 'border-stone-200 text-foreground/60 hover:text-foreground'
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      <div className="mt-7 flex items-center justify-between border-b border-stone-200 pb-3.5">
        <span className="text-sm text-foreground/50">
          {total} {total === 1 ? 'variety' : 'varieties'}
        </span>
        <div className="inline-flex overflow-hidden rounded-lg border border-stone-200">
          {(['list', 'grid'] as View[]).map((v) => (
            <button
              key={v}
              type="button"
              onClick={() => setView(v)}
              className={`px-3.5 py-1.5 text-sm capitalize transition-colors ${
                view === v
                  ? 'bg-foreground text-background'
                  : 'text-foreground/60 hover:text-foreground'
              }`}
            >
              {v}
            </button>
          ))}
        </div>
      </div>

      {total === 0 ? (
        <p className="py-20 text-center text-foreground/50">
          {groups.length === 0
            ? 'Inventory is being set up — check back soon.'
            : 'No varieties match your search.'}
        </p>
      ) : view === 'list' ? (
        <ListView groups={filteredGroups} />
      ) : (
        <GridView groups={filteredGroups} />
      )}
    </div>
  );
}

function ListView({ groups }: { groups: BrowseCropGroup[] }) {
  return (
    <div>
      {groups.map((group) => (
        <section key={group.cropName} className="mt-8">
          <h2 className="mb-1 text-xs font-medium uppercase tracking-wider text-foreground/40">
            {group.cropName}
          </h2>
          {group.varieties.map((v) => (
            <VarietyRow key={v.id} variety={v} />
          ))}
        </section>
      ))}
    </div>
  );
}

function VarietyRow({ variety }: { variety: BrowseVariety }) {
  const price = priceFromLabel(variety);
  return (
    <Link
      href={`/v/${variety.slug}`}
      className="grid grid-cols-[1fr_auto] items-start gap-x-4 gap-y-1 border-b border-stone-100 py-4 transition-colors hover:bg-stone-50"
    >
      <span className="font-medium text-foreground">{variety.name}</span>
      <span className="flex flex-col items-end gap-1.5">
        <StatusBadge status={variety.status} />
        <span className="whitespace-nowrap text-sm text-foreground/60">
          {price ?? '—'}
        </span>
      </span>
      {variety.description ? (
        <span className="col-span-1 line-clamp-1 text-sm text-foreground/60">
          {variety.description}
        </span>
      ) : null}
    </Link>
  );
}

function GridView({ groups }: { groups: BrowseCropGroup[] }) {
  const varieties = groups.flatMap((g) => g.varieties);
  return (
    <div className="mt-6 grid grid-cols-1 gap-3.5 sm:grid-cols-2 md:grid-cols-3">
      {varieties.map((v) => (
        <VarietyCard key={v.id} variety={v} />
      ))}
    </div>
  );
}

function VarietyCard({ variety }: { variety: BrowseVariety }) {
  const price = priceFromLabel(variety);
  return (
    <Link
      href={`/v/${variety.slug}`}
      className="flex min-h-[9rem] flex-col gap-2 rounded-xl border border-stone-200 p-4 transition-colors hover:border-stone-300"
    >
      <div className="flex items-center justify-between">
        <span className="text-xs uppercase tracking-wider text-foreground/40">
          {variety.cropName}
        </span>
        <StatusBadge status={variety.status} />
      </div>
      <span className="font-medium text-foreground">{variety.name}</span>
      {variety.description ? (
        <span className="line-clamp-2 text-sm text-foreground/60">
          {variety.description}
        </span>
      ) : null}
      <span className="mt-auto pt-1 text-sm text-foreground/60">
        {price ?? '—'}
      </span>
    </Link>
  );
}
