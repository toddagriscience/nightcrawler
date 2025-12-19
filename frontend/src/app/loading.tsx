// Copyright © Todd Agriscience, Inc. All rights reserved.

export default async function DashboardLoading() {
  return (
    <div className="bg-background min-h-screen flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <h1 className="text-4xl">
          Fetching crops...
          <span className="ellipsis" />
        </h1>
      </div>
    </div>
  );
}
