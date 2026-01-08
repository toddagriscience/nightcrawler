// Copyright © Todd Agriscience, Inc. All rights reserved.

import { FadeIn } from '@/components/common';
import { Spinner } from '@/components/ui/spinner';

/**
 * This component is used to display a loading state for the general site.
 */
export default async function Loading() {
  return (
    <FadeIn className="bg-background min-h-screen flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <Spinner />
      </div>
    </FadeIn>
  );
}
