// Copyright © Todd Agriscience, Inc. All rights reserved.

import { Skeleton } from '@/components/ui/skeleton';

/** Number of skeleton rows shown per category while the dropdown is loading. */
const SKELETON_COUNT = 3;

/**
 * Placeholder skeleton displayed inside the search dropdown while
 * debounced results are loading. Mirrors the two-category layout.
 *
 * @returns Skeleton UI matching the dropdown item layout
 */
export function SearchDropdownSkeleton() {
  return (
    <div className="space-y-3 p-3" aria-busy="true" aria-live="polite">
      <Skeleton className="mb-1.5 h-3 w-16 rounded bg-foreground/15" />
      {Array.from({ length: SKELETON_COUNT }).map((_, index) => (
        <Skeleton
          key={`imp-skeleton-${index}`}
          className="h-5 w-full rounded bg-foreground/10"
        />
      ))}

      <Skeleton className="mt-3 mb-1.5 h-3 w-24 rounded bg-foreground/15" />
      {Array.from({ length: SKELETON_COUNT }).map((_, index) => (
        <Skeleton
          key={`seed-skeleton-${index}`}
          className="h-5 w-full rounded bg-foreground/10"
        />
      ))}
    </div>
  );
}
