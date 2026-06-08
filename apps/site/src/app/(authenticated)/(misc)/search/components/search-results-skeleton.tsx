// Copyright © Todd Agriscience, Inc. All rights reserved.

import { Card } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

export function SearchResultsSkeleton({ count = 4 }: { count?: number }) {
  return (
    <div className="space-y-5" aria-live="polite" aria-busy="true">
      {Array.from({ length: count }).map((_, index) => (
        <Card key={index} className="bg-card p-6">
          {/* Meta row skeleton */}
          <div className="flex items-center gap-3 mb-4">
            <Skeleton className="h-3 w-16 bg-muted/60" />
            <Skeleton className="h-3 w-3 bg-muted/60 rounded-none" />
            <Skeleton className="h-3 w-12 bg-muted/60" />
          </div>
          {/* Title skeleton */}
          <Skeleton className="h-6 w-3/4 mb-3 bg-muted/60" />
          {/* Content lines skeleton */}
          <Skeleton className="h-4 w-full mb-2 bg-muted/60" />
          <Skeleton className="h-4 w-11/12 mb-2 bg-muted/60" />
          <Skeleton className="h-4 w-4/5 bg-muted/60" />
        </Card>
      ))}
    </div>
  );
}
