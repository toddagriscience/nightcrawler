// Copyright © Todd Agriscience, Inc. All rights reserved.

'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useTransition } from 'react';
import { useForm } from 'react-hook-form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { SearchClientProps } from './types';
import { SearchResultsSkeleton } from './components/search-results-skeleton';
import { SearchResultCard } from './components/search-result-card';

interface SearchFormValues {
  q: string;
}

export function SearchClient({ query, results, error }: SearchClientProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [isTransitionPending, startTransition] = useTransition();
  const {
    register,
    handleSubmit,
    setValue,
    formState: { isSubmitting },
  } = useForm<SearchFormValues>({
    defaultValues: {
      q: query,
    },
  });

  const isLoading = isSubmitting || isTransitionPending;

  useEffect(() => {
    setValue('q', query);
  }, [query, setValue]);

  async function onSubmit(data: SearchFormValues) {
    const nextQuery = data.q.trim();
    const params = new URLSearchParams();
    if (nextQuery) {
      params.set('q', nextQuery);
    }

    const nextUrl = params.toString()
      ? `${pathname}?${params.toString()}`
      : pathname;
    startTransition(() => {
      router.replace(nextUrl);
    });
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <h1 className="text-2xl font-bold text-foreground mb-2">
        Todd Knowledge Base
      </h1>
      <p className="text-foreground/60 mb-8">
        Search our guides, recommendations, and seed catalog.
      </p>

      <form
        method="GET"
        onSubmit={handleSubmit(onSubmit)}
        className="flex gap-3 mb-8"
      >
        <Input
          {...register('q')}
          placeholder="Search topics... (e.g. carrots, soil pH, cover crops)"
          className="flex-1"
        />
        <Button
          type="submit"
          disabled={isLoading}
          variant={'brand'}
          className="hover:cursor-pointer"
        >
          Search
        </Button>
      </form>

      {isLoading && <SearchResultsSkeleton />}

      {error && <p className="text-red-600 mb-4">{error}</p>}

      {!isLoading && !error && query.length === 0 && (
        <p className="text-foreground/60 mb-4">Search to get started.</p>
      )}

      {!isLoading && !error && query.length > 0 && results.length === 0 && (
        <div className="p-6 text-center">
          <p className="text-foreground/80 mb-2">
            We don&apos;t have information on that topic yet.
          </p>
          <p className="text-foreground font-medium">
            Please{' '}
            <Link href="/contact" className="underline hover:opacity-70">
              contact a Todd advisor
            </Link>{' '}
            for help with &quot;{query}&quot;.
          </p>
        </div>
      )}

      {!isLoading && !error && results.length > 0 && (
        <div className="space-y-4">
          {results.map((result) => (
            <SearchResultCard key={result.id} result={result} />
          ))}
        </div>
      )}
    </div>
  );
}
