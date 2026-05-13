// Copyright © Todd Agriscience, Inc. All rights reserved.

'use client';

import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Link } from '@/i18n/config';
import type { SanityArticle } from '@/lib/sanity/article-types';
import { getArticleCardHref } from '@/lib/sanity/article-urls';
import { BiSearch } from 'react-icons/bi';
import { useTranslations } from 'next-intl';
import { useMemo } from 'react';
import { Controller, useForm, useWatch } from 'react-hook-form';

interface CareersJobListProps {
  /** Careers collection documents from Sanity */
  items: SanityArticle[];
}

/** Sentinel for “no team filter”. */
const ALL_TEAMS_VALUE = '__all_teams__';
/** Sentinel for “no location filter”. */
const ALL_LOCATIONS_VALUE = '__all_locations__';

interface JobFiltersFormValues {
  search: string;
  team: string;
  location: string;
}

/** Department / label shown after the role title (`company`, else `subtitle`). */
function departmentLabel(item: SanityArticle): string | null {
  const fromCompany = item.company?.trim();
  if (fromCompany !== undefined && fromCompany.length > 0) return fromCompany;
  const fromSubtitle = item.subtitle?.trim();
  if (fromSubtitle !== undefined && fromSubtitle.length > 0)
    return fromSubtitle;
  return null;
}

/** Primary location field for filtering and display (`jobLocation`). */
function locationLabel(item: SanityArticle): string | null {
  const loc = item.jobLocation?.trim();
  return loc !== undefined && loc.length > 0 ? loc : null;
}

function isExternalPosting(
  article: Pick<SanityArticle, 'offSiteUrl'>
): boolean {
  const url = article.offSiteUrl;
  return url !== undefined && url !== null && String(url).trim() !== '';
}

/** Normalizes searchable text without allocating per keystroke regex. */
function containsIgnoreCase(haystack: string, needle: string): boolean {
  if (needle.length === 0) return true;
  return haystack.toLowerCase().includes(needle.toLowerCase());
}

/**
 * Careers index layout: toolbar (search + filters + counts) and list rows styled like the Todd careers reference.
 *
 * @param props - Careers documents from Sanity
 */
export function CareersJobList({ items }: CareersJobListProps) {
  const t = useTranslations('careers');

  const teamOptions = useMemo(() => {
    const raw = items
      .map(departmentLabel)
      .filter((d): d is string => d !== null && d.length > 0);
    const unique = [...new Set(raw)].sort((a, b) =>
      a.localeCompare(b, undefined, { sensitivity: 'base' })
    );
    return unique.map((department) => ({
      value: department,
      label: department,
    }));
  }, [items]);

  const locationOptions = useMemo(() => {
    const raw = items
      .map(locationLabel)
      .filter((l): l is string => l !== null && l.length > 0);
    const unique = [...new Set(raw)].sort((a, b) =>
      a.localeCompare(b, undefined, { sensitivity: 'base' })
    );
    return unique.map((city) => ({ value: city, label: city }));
  }, [items]);

  const { register, control } = useForm<JobFiltersFormValues>({
    defaultValues: {
      search: '',
      team: ALL_TEAMS_VALUE,
      location: ALL_LOCATIONS_VALUE,
    },
    mode: 'onChange',
  });

  const [search, teamFilter, locationFilter] = useWatch({
    control,
    name: ['search', 'team', 'location'],
  });

  const filteredItems = useMemo(() => {
    const q = search.trim();
    return items.filter((item) => {
      const dept = departmentLabel(item);
      const loc = locationLabel(item);

      if (teamFilter !== ALL_TEAMS_VALUE) {
        if (dept !== teamFilter) return false;
      }

      if (locationFilter !== ALL_LOCATIONS_VALUE) {
        if (loc !== locationFilter) return false;
      }

      if (q.length > 0) {
        const parts = [
          item.title,
          dept ?? '',
          loc ?? '',
          item.company ?? '',
          item.summary ?? '',
        ];
        const combined = parts.join(' ');
        if (!containsIgnoreCase(combined, q)) return false;
      }

      return true;
    });
  }, [items, locationFilter, search, teamFilter]);

  const total = items.length;
  const visible = filteredItems.length;

  return (
    <div className="w-full">
      <form
        className="mb-10 w-full"
        role="search"
        aria-label={t('jobListings.toolbarAria')}
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
                id="careers-job-search"
                type="search"
                autoComplete="off"
                className="h-9 min-w-0 flex-1 rounded-none border-0 bg-transparent px-0 py-1 font-normal shadow-none outline-none placeholder:text-[#848484] focus-visible:ring-0"
                placeholder={t('jobListings.searchPlaceholder')}
                aria-label={t('jobListings.searchAria')}
              />
            </div>
            <p className="text-sm font-normal text-[#848484]">
              {t('jobListings.showingCount', {
                visible,
                total,
              })}
            </p>
          </div>
          <div className="flex flex-row flex-nowrap items-center justify-start gap-2 sm:justify-end sm:gap-3">
            <Controller
              name="team"
              control={control}
              render={({ field }) => (
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger
                    className="inline-flex h-auto !w-max min-w-0 max-w-none items-center justify-start gap-2 rounded-none border-0 bg-transparent py-2 pl-0 pr-0 text-left text-sm font-normal text-foreground shadow-none focus-visible:ring-1 focus-visible:ring-offset-2 [&>span]:line-clamp-none [&>span]:whitespace-nowrap"
                    aria-label={t('jobListings.teamFilterAria')}
                  >
                    <SelectValue
                      placeholder={t('jobListings.filterAllTeams')}
                    />
                  </SelectTrigger>
                  <SelectContent align="end">
                    <SelectItem value={ALL_TEAMS_VALUE}>
                      {t('jobListings.filterAllTeams')}
                    </SelectItem>
                    {teamOptions.map(({ value }) => (
                      <SelectItem key={value} value={value}>
                        {value}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />

            <Controller
              name="location"
              control={control}
              render={({ field }) => (
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger
                    className="inline-flex h-auto !w-max min-w-0 max-w-none items-center justify-start gap-2 rounded-none border-0 bg-transparent py-2 pl-0 pr-0 text-left text-sm font-normal text-foreground shadow-none focus-visible:ring-1 focus-visible:ring-offset-2 [&>span]:line-clamp-none [&>span]:whitespace-nowrap"
                    aria-label={t('jobListings.locationFilterAria')}
                  >
                    <SelectValue
                      placeholder={t('jobListings.filterAllLocations')}
                    />
                  </SelectTrigger>
                  <SelectContent align="end">
                    <SelectItem value={ALL_LOCATIONS_VALUE}>
                      {t('jobListings.filterAllLocations')}
                    </SelectItem>
                    {locationOptions.map(({ value }) => (
                      <SelectItem key={value} value={value}>
                        {value}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
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
          {t('jobListings.noMatches')}
        </p>
      ) : null}

      {filteredItems.length > 0 ? (
        <ul className="w-full list-none pl-0 pr-0">
          {filteredItems.map((item) => {
            const href = getArticleCardHref(item);
            const external = isExternalPosting(item);
            const dept = departmentLabel(item);
            const loc = locationLabel(item);

            const applyControl = external ? (
              <a
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex shrink-0 text-sm font-normal text-foreground underline-offset-4 transition hover:underline"
              >
                {t('jobListings.apply')}
              </a>
            ) : (
              <Link
                href={href}
                className="inline-flex shrink-0 text-sm font-normal text-foreground underline-offset-4 transition hover:underline"
              >
                {t('jobListings.apply')}
              </Link>
            );

            return (
              <li
                key={item.slug.current}
                className="border-b border-black/10 py-5 first:pt-0 last:border-b-0 md:py-6"
              >
                <div className="grid grid-cols-1 gap-3 md:grid-cols-[minmax(0,1fr)_auto_auto] md:items-baseline md:gap-x-6 lg:gap-x-10">
                  <div className="min-w-0 text-base leading-snug">
                    <span className="font-normal text-foreground">
                      {item.title}
                    </span>
                    {dept !== null ? (
                      <span className="font-normal text-[#848484]">{` · ${dept}`}</span>
                    ) : null}
                  </div>
                  <span className="shrink-0 text-sm font-normal text-[#848484] md:text-right md:tabular-nums">
                    {loc !== null ? loc : t('jobListings.locationNotListed')}
                  </span>
                  <div className="shrink-0 md:text-right">{applyControl}</div>
                </div>
              </li>
            );
          })}
        </ul>
      ) : null}
    </div>
  );
}
