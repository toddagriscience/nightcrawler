// Copyright © Todd Agriscience, Inc. All rights reserved.

import { FadeIn } from '@/components/common';
import { Spinner } from '@/components/ui/spinner';

/**
 * This component is used to display a loading state for authenticated paths.
 */
export default async function DashboardLoading() {
  return (
    <FadeIn className="bg-background-platform min-h-screen flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <Spinner />
      </div>
    </FadeIn>
  );
}
