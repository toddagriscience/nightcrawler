// Copyright © Todd Agriscience, Inc. All rights reserved.

import { UserSelect } from '@/lib/types/db';
import { NamedTab } from './types';
import { TabsContent } from '@/components/ui/tabs';
import Landing from '../landing';
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
      {!currentTabs.length ? (
        <TabsContent value="home">
          <Landing currentUser={currentUser} />
        </TabsContent>
      ) : (
        currentTabs.map((tab) => (
          <TabsContent key={tab.id} value={getTabHash(tab)}>
            <h1>{tab.name}</h1>
          </TabsContent>
        ))
      )}
    </>
  );
}
