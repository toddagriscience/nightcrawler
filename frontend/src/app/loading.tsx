// Copyright © Todd Agriscience, Inc. All rights reserved.

import { Spinner } from '../components/ui/spinner';
/**
 * This component is used to display a loading state for the general site.
 */
export default async function Loading() {
  return (
    <div className="bg-background min-h-screen flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <Spinner />
        <h1 className="text-4xl">
          LOADING
          <span className="ellipsis" />
        </h1>
      </div>
    </div>
  );
}
