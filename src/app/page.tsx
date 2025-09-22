// Copyright Todd LLC, All rights reserved.

/**
 * Dashboard page - served at "/" route for authenticated users
 * This page is protected by middleware and only accessible to authenticated users
 * Will need to be updated later to show the proper dashboard
 * @returns {React.ReactNode} - The dashboard page component
 */
export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <header className="mb-8">
            <h1 className="text-3xl font-bold text-foreground mb-2">
              Dashboard
            </h1>
          </header>
          <div className="text-sm text-muted-foreground">Coming soon...</div>
        </div>
      </div>
    </div>
  );
}
