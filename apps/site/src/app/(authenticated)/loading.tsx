// Copyright © Todd Agriscience, Inc. All rights reserved.

import ToddHeader from '../../components/common/wordmark/todd-wordmark';

/**
 * This component is used to display a loading state for authenticated paths.
 */
export default async function DashboardLoading() {
  return (
    <>
      <header className="w-full" role="banner">
        <div className="mx-auto max-w-[107rem] mt-4 px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <ToddHeader className="flex min-h-10 flex-row items-center" />
          </div>
        </div>
      </header>
      <div className="fixed inset-0 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <h1 className="text-2xl">
            Thinking
            <span className="ellipsis" />
          </h1>
        </div>
      </div>
    </>
  );
}
