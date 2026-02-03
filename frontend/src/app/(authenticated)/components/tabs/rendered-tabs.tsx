// Copyright © Todd Agriscience, Inc. All rights reserved.

import { Tabs, TabsContent } from '@/components/ui/tabs';
import { Tab } from './types';
import Landing from '../landing';
import { getTabHash } from './helpers';
import PlatformTabsList from './tabs-list';

/**  
   Scaling is a little bit scuffed here. We're taking a div and shoving it into `AuthenticatedHeader` manually, then scaling it accordingly with variables #'s of tabs. This technically works with up to 25 tabs on the smallest screen size. This is fine because the user will be limited to a maximum of 8 tabs.
   */
export default function RenderedTabs({ currentTabs }: { currentTabs: Tab[] }) {
  return (
    <Tabs defaultValue={currentTabs ? getTabHash(currentTabs[0]) : 'home'}>
      <PlatformTabsList currentTabs={currentTabs} />
      {!currentTabs.length ? (
        <TabsContent value="home">
          <Landing />
        </TabsContent>
      ) : (
        currentTabs.map((tab) => (
          <TabsContent key={tab.id} value={getTabHash(tab)}>
            <h1>{tab.name}</h1>
          </TabsContent>
        ))
      )}
    </Tabs>
  );
}
