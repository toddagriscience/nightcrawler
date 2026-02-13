// Copyright © Todd Agriscience, Inc. All rights reserved.

import { UserSelect } from '@/lib/types/db';
import { NamedTab } from './types';
import { TabsContent } from '@/components/ui/tabs';
import Landing from '../landing';
import { getTabHash } from './utils';
import CurrentTab from './current-tab';

export default async function PlatformTabContent({
  currentTabs,
  currentUser,
}: {
  currentTabs: NamedTab[];
  currentUser: UserSelect;
}) {
  return (
    <>
      {!currentTabs.length ? (
        <TabsContent value="home">
          <Landing currentUser={currentUser} />
        </TabsContent>
      ) : (
        currentTabs.map((tab) => (
          <TabsContent
            key={tab.id}
            value={getTabHash(tab)}
            className="h-full w-full"
          >
            <CurrentTab currentTab={tab} />
          </TabsContent>
        ))
      )}
    </>
  );
}
