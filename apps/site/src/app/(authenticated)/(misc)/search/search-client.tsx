// Copyright © Todd Agriscience, Inc. All rights reserved.

'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useTransition } from 'react';
import { useForm } from 'react-hook-form';
import { motion, AnimatePresence } from 'framer-motion';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import type { SearchClientProps, SearchFormValues } from './types';
import { SearchResultsSkeleton } from './components/search-results-skeleton';
import { SearchResultCard } from './components/search-result-card';

/** Stagger container variants for result cards */
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
    },
  },
};

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
    <div className="max-w-3xl mx-auto px-6 py-16">
      {/* Editorial header */}
      <header className="mb-12">
        <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground mb-3">
          Knowledge Base
        </p>
        <h1 className="text-4xl font-light text-foreground tracking-tight mb-4">
          Search Guides & Catalog
        </h1>
        <p className="text-base text-muted-foreground max-w-lg">
          Find growing guides, seed recommendations, and integrated management
          practices.
        </p>
      </header>

      {/* Search form */}
      <form
        method="GET"
        onSubmit={handleSubmit(onSubmit)}
        className="flex gap-3 mb-12"
      >
        <div className="relative flex-1">
          <Input
            {...register('q')}
            placeholder="Search topics, crops, practices..."
            className="flex-1 h-12 pl-4 pr-12 text-base bg-background border-border rounded-none focus:rounded-md transition-all duration-200 placeholder:text-muted-foreground/60"
          />
        </div>
        <Button
          type="submit"
          disabled={isLoading}
          variant={'brand'}
          className="h-12 px-6 hover:cursor-pointer rounded-none border-border"
        >
          Search
        </Button>
      </form>

      {isLoading && <SearchResultsSkeleton />}

      {error && (
        <p className="text-destructive text-sm mb-4 font-medium">{error}</p>
      )}

      {!isLoading && !error && query.length === 0 && (
        <p className="text-muted-foreground text-sm">
          Enter a search term to explore our knowledge base.
        </p>
      )}

      {!isLoading && !error && query.length > 0 && results.length === 0 && (
        <div className="py-12 text-center">
          <p className="text-foreground/80 mb-3 text-lg font-normal">
            No results found for "{query}"
          </p>
          <p className="text-muted-foreground text-sm">
            Try different keywords, or{' '}
            <Link
              href="/contact"
              className="text-foreground underline underline-offset-4 hover:opacity-70 transition-opacity"
            >
              contact a Todd advisor
            </Link>{' '}
            for personalized guidance.
          </p>
        </div>
      )}

      {!isLoading && !error && results.length > 0 && (
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="space-y-5"
        >
          <AnimatePresence mode="popLayout">
            {results.map((result) => (
              <SearchResultCard
                key={`${result.resultType}-${result.id}`}
                result={result}
              />
            ))}
          </AnimatePresence>
        </motion.div>
      )}
    </div>
  );
}
