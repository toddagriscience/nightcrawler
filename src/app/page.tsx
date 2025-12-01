// Copyright (c) Todd Agriscience, Inc. All rights reserved.

/**
 * Dashboard page - served at "/" route for authenticated users
 * This page is protected by middleware and only accessible to authenticated users
 * Will need to be updated later to show the proper dashboard
 * @returns {React.ReactNode} - The dashboard page component
 */
export default function DashboardPage() {
  return (
    <div className="bg-background min-h-screen">
      <div className="container mx-auto px-4 py-8">
        <div className="mx-auto max-w-4xl">
          <header className="mb-8">
            <h1 className="text-foreground mb-2 text-3xl font-bold">
              Dashboard
            </h1>
          </header>
          <div className="text-muted-foreground text-sm">Coming soon...</div>
        </div>
      </div>
    </div>
  );
}
