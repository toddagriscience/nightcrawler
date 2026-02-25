// Copyright © Todd Agriscience, Inc. All rights reserved.

import { TabsContent } from '@/components/ui/tabs';
import { UserSelect } from '@/lib/types/db';
import Landing from '../landing';
import CurrentTab from './current-tab';
import { NamedTab } from './types';
import { getTabHash } from './utils';

export default async function PlatformTabContent({
  currentTabs,
  currentUser,
}: {
  currentTabs: NamedTab[];
  currentUser: UserSelect;
}) {
  return (
    <>
      {/** Guaranteed to work, see the query/set of queries in (authenticated)/page.tsx */}
      {!currentUser.approved ? (
        <TabsContent value={'home'}>
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
