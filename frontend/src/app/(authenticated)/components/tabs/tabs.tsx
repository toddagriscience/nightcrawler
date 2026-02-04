// Copyright © Todd Agriscience, Inc. All rights reserved.

'use client';

import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { NamedTab } from './types';
import { Button } from '@/components/ui';
import { getTabHash } from './utils';
import { ManagementZoneSelect, UserSelect } from '@/lib/types/db';
import updateTabName, {
  createTab as createTabAction,
  deleteTab as deleteTabAction,
} from './actions';
import logger from '@/lib/logger';
import NewTabDropdown from './new-tab-dropdown';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

const maxTabs = 8;

export default function PlatformTabs({
  currentTabs,
  currentUser,
  managementZones,
  children,
}: {
  currentTabs: NamedTab[];
  currentUser: UserSelect;
  managementZones: ManagementZoneSelect[];
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [curTab, setCurTab] = useState(
    currentTabs.length !== 0 ? getTabHash(currentTabs[0]) : 'home'
  );

  async function setCurTabHelper({ newTabId }: { newTabId?: NamedTab }) {
    if (currentTabs.length === 0) {
      setCurTab('home');
    } else if (newTabId) {
      setCurTab(getTabHash(newTabId));
    } else {
      setCurTab(getTabHash(currentTabs[0]));
    }
  }

  async function createTab(
    managementZoneId: number,
    managementZoneName: string | null
  ) {
    const maybeNewTab = await createTabAction(managementZoneId);

    if (maybeNewTab.error) {
      logger.error(maybeNewTab.error);
      return;
    }

    router.refresh();

    setCurTabHelper({
      newTabId: {
        name: managementZoneName || 'Untitled Zone',
        managementZone: managementZoneId,
        id: maybeNewTab.data!.tabId,
        user: currentUser.id,
      },
    });
  }

  async function deleteTab(tab: NamedTab) {
    const tabId = tab.id;
    const result = await deleteTabAction({ tabId });

    if (result.error) {
      logger.error(result.error);
      return;
    }

    router.refresh();

    setCurTabHelper({});
  }

  async function updateTab(newName: string, tabId: number) {
    const result = await updateTabName({ newName, tabId });

    if (result.error) {
      logger.error(result.error);
      return;
    }

    router.refresh();
  }

  return (
    <Tabs value={curTab}>
      <div className="absolute top-4 left-40 max-w-[70vw] min-[107rem]:right-0 min-[107rem]:left-0 min-[107rem]:m-auto min-[107rem]:w-[107rem] min-[107rem]:max-w-350">
        <TabsList className="flex flex-row flex-nowrap justify-start gap-2 bg-transparent">
          {!currentTabs.length ? (
            <TabsTrigger
              value="home"
              className="w-36 max-w-56 flex-1 truncate overflow-hidden border-none text-left text-ellipsis whitespace-nowrap data-[state=active]:bg-gray-200"
              onClick={() => setCurTabHelper({})}
            >
              Home
            </TabsTrigger>
          ) : (
            currentTabs.map((tab, index) => (
              <TabsTrigger
                className="pl-2 group max-w-36 min-w-36 truncate border-none data-[state=active]:bg-gray-200 group"
                key={tab.id}
                value={getTabHash(tab)}
                onClick={() => setCurTabHelper({ newTabId: tab })}
              >
                <input
                  className="max-w-[100%] cursor-pointer text-center ring-0 outline-none group-data-[state=active]:pointer-events-auto pointer-events-none focus:ring-0 focus:outline-none"
                  defaultValue={tab.name || `Untitled Zone ${index}`}
                  onChange={(e) => updateTab(e.target.value, tab.id)}
                />
                {/** This isn't the best solution, but it's the easiest way to nest buttons. Getting the entire background to render with a wrapping div via data-[state=active] is just a pain */}
                <div
                  aria-roledescription="Close the current tab"
                  role="button"
                  onClick={() => deleteTab(tab)}
                  className="group-hover:block hidden p-0 h-min"
                >
                  X
                </div>
                <div className="group-hover:hidden block min-w-2"></div>
              </TabsTrigger>
            ))
          )}
          {currentTabs.length <= maxTabs && (
            <NewTabDropdown
              managementZones={managementZones}
              addTab={createTab}
            >
              <Button className="ml-2 min-w-10 cursor-pointer border-none text-4xl font-light focus-visible:ring-0! focus-visible:outline-none">
                <span className="absolute top-[-3.5px]">+</span>
              </Button>
            </NewTabDropdown>
          )}
          <div className="grow"></div>
        </TabsList>
        {children}
      </div>
    </Tabs>
  );
}
