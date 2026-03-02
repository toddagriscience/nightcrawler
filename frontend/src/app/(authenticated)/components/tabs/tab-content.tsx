// Copyright © Todd Agriscience, Inc. All rights reserved.

import { TabsContent } from '@/components/ui/tabs';
import type { AuthenticatedInfo } from '@/lib/types/get-authenticated-info';
import Landing from '../landing';
import CurrentTab from './current-tab';
import { NamedTab } from './types';
import { getTabHash } from './utils';

export default async function PlatformTabContent({
  currentTabs,
  currentUser,
  selectedTabHash,
}: {
  currentTabs: NamedTab[];
  currentUser: AuthenticatedInfo;
  selectedTabHash: string;
}) {
  const selectedTab =
    currentTabs.find((tab) => getTabHash(tab) === selectedTabHash) ||
    currentTabs[0];

  return (
    <>
      {/** Guaranteed to work, see the query/set of queries in (authenticated)/page.tsx */}
      {!currentUser.approved || currentTabs.length === 0 ? (
        <TabsContent value={'home'}>
          <Landing
            currentUser={currentUser}
            hasNoManagementZones={
              currentUser.approved && currentTabs.length === 0
            }
          />
        </TabsContent>
      ) : (
        selectedTab && (
          <TabsContent
            key={selectedTab.id}
            value={getTabHash(selectedTab)}
            className="h-full w-full"
          >
            <CurrentTab currentTab={selectedTab} />
          </TabsContent>
        )
      )}
    </>
  );
}
