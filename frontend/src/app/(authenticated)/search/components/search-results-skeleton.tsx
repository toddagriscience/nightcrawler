// Copyright © Todd Agriscience, Inc. All rights reserved.

import { Card } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

export function SearchResultsSkeleton({ count = 4 }: { count?: number }) {
  return (
    <div className="space-y-4" aria-live="polite" aria-busy="true">
      {Array.from({ length: count }).map((_, index) => (
        <Card key={index} className="p-6 bg-white">
          <div className="flex items-center gap-2 mb-4">
            <Skeleton className="h-5 w-20 rounded-full bg-foreground/15" />
            <Skeleton className="h-4 w-28 bg-foreground/15" />
          </div>
          <Skeleton className="h-6 w-3/4 mb-3 bg-foreground/15" />
          <Skeleton className="h-4 w-full mb-2 bg-foreground/15" />
          <Skeleton className="h-4 w-11/12 mb-2 bg-foreground/15" />
          <Skeleton className="h-4 w-5/6 bg-foreground/15" />
        </Card>
      ))}
    </div>
  );
}
