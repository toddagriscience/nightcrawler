// Copyright © Todd Agriscience, Inc. All rights reserved.

import { TabsContent } from '@/components/ui/tabs';
import type { AuthenticatedInfo } from '@/lib/types/get-authenticated-info';
import CurrentTab from './current-tab';
import { NamedTab } from './types';
import { getTabHash } from './utils';

export default async function PlatformTabContent({
  currentTabs,
  selectedTabHash,
}: {
  currentTabs: NamedTab[];
  selectedTabHash: string;
}) {
  const selectedTab =
    currentTabs.find((tab) => getTabHash(tab) === selectedTabHash) ||
    currentTabs[0];

  return (
    <TabsContent
      key={selectedTab.id}
      value={getTabHash(selectedTab)}
      className="h-full w-full"
    >
      <CurrentTab currentTab={selectedTab} />
    </TabsContent>
  );
}
