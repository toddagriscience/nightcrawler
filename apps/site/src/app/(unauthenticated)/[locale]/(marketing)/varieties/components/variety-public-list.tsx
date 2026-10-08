// Copyright © Todd Agriscience, Inc. All rights reserved.

'use client';

import { Input } from '@/components/ui/input';
import { Link } from '@/i18n/config';
import { useTranslations } from 'next-intl';
import { useMemo } from 'react';
import { BiSearch } from 'react-icons/bi';
import { Controller, useForm, useWatch } from 'react-hook-form';
import { MarketingFilterDropdown } from '../../components/marketing-filter-dropdown';
import type { PublicVariety, PublicVarietyStatus } from '../types';

interface VarietyPublicListProps {
  /** Varieties loaded from the seed_variety / seed_crop tables */
  items: PublicVariety[];
}

/** Sentinel for "no crop filter". */
const ALL_CROPS_VALUE = '__all_crops__';
/** Sentinel for "no availability filter". */
const ALL_AVAILABILITY_VALUE = '__all_availability__';

interface VarietyFiltersFormValues {
  search: string;
  crop: string;
  availability: string;
}

/** Matches the careers toolbar filter styling. */
const VARIETY_FILTER_TRIGGER_CLASS =
  'inline-flex h-auto w-max min-w-0 max-w-none items-center justify-start gap-1 rounded-none border-0 bg-transparent py-2 pl-0 pr-0 text-left text-sm font-normal text-foreground shadow-none outline-none focus-visible:ring-1 focus-visible:ring-offset-2';

/** Normalizes searchable text without allocating per keystroke regex. */
function containsIgnoreCase(haystack: string, needle: string): boolean {
  if (needle.length === 0) return true;
  return haystack.toLowerCase().includes(needle.toLowerCase());
}

/**
 * Public variety index: toolbar (search + crop/availability filters + count)
 * and list rows, styled after the careers job listing.
 *
 * @param props - Varieties from the seed inventory
 */
export function VarietyPublicList({ items }: VarietyPublicListProps) {
  const t = useTranslations('varieties');

  const cropOptions = useMemo(() => {
    const unique = [...new Set(items.map((item) => item.cropName))].sort(
      (a, b) => a.localeCompare(b, undefined, { sensitivity: 'base' })
    );
    return unique.map((cropName) => ({ value: cropName, label: cropName }));
  }, [items]);

  const availabilityOptions: { value: PublicVarietyStatus; label: string }[] = [
    { value: 'available', label: t('list.availabilityAvailable') },
    { value: 'back_order', label: t('list.availabilityBackOrder') },
    { value: 'reference', label: t('list.availabilityReference') },
  ];

  const { register, control } = useForm<VarietyFiltersFormValues>({
    defaultValues: {
      search: '',
      crop: ALL_CROPS_VALUE,
      availability: ALL_AVAILABILITY_VALUE,
    },
    mode: 'onChange',
  });

  const [search, cropFilter, availabilityFilter] = useWatch({
    control,
    name: ['search', 'crop', 'availability'],
  });

  const filteredItems = useMemo(() => {
    const q = search.trim();
    return items.filter((item) => {
      if (cropFilter !== ALL_CROPS_VALUE && item.cropName !== cropFilter)
        return false;

      if (
        availabilityFilter !== ALL_AVAILABILITY_VALUE &&
        item.status !== availabilityFilter
      )
        return false;

      if (q.length > 0) {
        const combined = [item.name, item.description ?? '', item.cropName]
          .join(' ')
          .trim();
        if (!containsIgnoreCase(combined, q)) return false;
      }

      return true;
    });
  }, [availabilityFilter, cropFilter, items, search]);

  const total = items.length;
  const visible = filteredItems.length;

  return (
    <div className="w-full">
      <form
        className="mb-10 w-full"
        role="search"
        aria-label={t('list.toolbarAria')}
        onSubmit={(e) => {
          e.preventDefault();
        }}
      >
        <div className="grid w-full grid-cols-1 gap-x-8 gap-y-6 border-foreground/10 pb-6 md:grid-cols-[minmax(0,1fr)_auto] md:items-end">
          <div className="flex min-w-0 flex-col gap-2">
            <div className="flex w-full items-center gap-3 border-b border-[#dcdcdc] pb-2">
              <BiSearch
                aria-hidden
                className="h-4 w-4 shrink-0 text-[#848484]"
                strokeWidth={2}
              />
              <Input
                {...register('search')}
                id="variety-search"
                type="search"
                autoComplete="off"
                className="h-9 min-w-0 flex-1 rounded-none border-0 bg-transparent px-0 py-1 font-normal shadow-none outline-none placeholder:text-[#848484] focus-visible:ring-0"
                placeholder={t('list.searchPlaceholder')}
                aria-label={t('list.searchAria')}
              />
            </div>
            <p className="text-sm font-normal text-[#848484]">
              {t('list.showingCount', { visible, total })}
            </p>
          </div>
          <div className="flex flex-row flex-nowrap items-center justify-start gap-2 sm:justify-end sm:gap-3">
            <Controller
              name="crop"
              control={control}
              render={({ field }) => (
                <MarketingFilterDropdown
                  value={field.value}
                  onValueChange={field.onChange}
                  options={[
                    { value: ALL_CROPS_VALUE, label: t('list.filterAllCrops') },
                    ...cropOptions,
                  ]}
                  placeholder={t('list.filterAllCrops')}
                  ariaLabel={t('list.cropFilterAria')}
                  emptyValue={ALL_CROPS_VALUE}
                  triggerClassName={VARIETY_FILTER_TRIGGER_CLASS}
                />
              )}
            />

            <Controller
              name="availability"
              control={control}
              render={({ field }) => (
                <MarketingFilterDropdown
                  value={field.value}
                  onValueChange={field.onChange}
                  options={[
                    {
                      value: ALL_AVAILABILITY_VALUE,
                      label: t('list.filterAllAvailability'),
                    },
                    ...availabilityOptions,
                  ]}
                  placeholder={t('list.filterAllAvailability')}
                  ariaLabel={t('list.availabilityFilterAria')}
                  emptyValue={ALL_AVAILABILITY_VALUE}
                  triggerClassName={VARIETY_FILTER_TRIGGER_CLASS}
                />
              )}
            />
          </div>
        </div>
      </form>

      {filteredItems.length === 0 && total > 0 ? (
        <p
          className="w-full py-14 text-center text-sm font-normal text-[#848484]"
          role="status"
        >
          {t('list.noMatches')}
        </p>
      ) : null}

      {filteredItems.length > 0 ? (
        <ul className="w-full list-none pl-0 pr-0">
          {filteredItems.map((item) => (
            <li
              key={item.id}
              className="border-b border-black/10 py-5 first:pt-0 last:border-b-0 md:py-6"
            >
              <div className="grid grid-cols-1 gap-3 md:grid-cols-[minmax(0,1fr)_auto_auto] md:items-baseline md:gap-x-6 lg:gap-x-10">
                <div className="min-w-0 text-sm leading-snug">
                  <span className="font-normal uppercase text-foreground">
                    {item.name}
                  </span>
                  {item.description !== null && item.description.length > 0 ? (
                    <span className="font-normal text-[#848484]">{`, ${item.description}`}</span>
                  ) : null}
                </div>
                <span className="shrink-0 text-sm font-normal text-[#848484] md:text-right md:tabular-nums">
                  {item.id}
                </span>
                <Link
                  href="/contact"
                  className="inline-flex shrink-0 text-sm font-normal text-foreground underline-offset-4 transition hover:underline"
                >
                  {t('list.apply')}
                </Link>
              </div>
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}
