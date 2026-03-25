// Copyright © Todd Agriscience, Inc. All rights reserved.

import { getTabs, getWidgets } from './actions';
import TabsWidgetsClient from './components/tabs-widgets-client';

/**
 * Tabs & Widgets management page.
 * Fetches initial data server-side and delegates interaction to the client component.
 */
export default async function TabsWidgetsPage() {
  const [initialTabs, initialWidgets] = await Promise.all([
    getTabs(),
    getWidgets(),
  ]);

  return (
    <TabsWidgetsClient
      initialTabs={initialTabs}
      initialWidgets={initialWidgets}
    />
  );
}
