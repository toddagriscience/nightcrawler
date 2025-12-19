// Copyright © Todd Agriscience, Inc. All rights reserved.

export default function PageLoading() {
  return (
    <div className="bg-background min-h-screen flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <h1 className="text-4xl">
          Loading
          <span className="ellipsis" />
        </h1>
      </div>
    </div>
  );
}
