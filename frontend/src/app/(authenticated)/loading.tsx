// Copyright © Todd Agriscience, Inc. All rights reserved.

/**
 * This component is used to display a loading state for authenticated paths.
 */
export default async function DashboardLoading() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <h1 className="text-2xl">
          Thinking
          <span className="ellipsis" />
        </h1>
      </div>
    </div>
  );
}
