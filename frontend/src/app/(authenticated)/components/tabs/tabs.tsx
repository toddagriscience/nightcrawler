// Copyright © Todd Agriscience, Inc. All rights reserved.

'use client';

import { Button } from '@/components/ui';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import logger from '@/lib/logger';
import { ManagementZoneSelect, UserSelect } from '@/lib/types/db';
import { X } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import updateTabName, {
  createTab as createTabAction,
  deleteTab as deleteTabAction,
} from './actions';
import NewTabDropdown from './new-tab-dropdown';
import { NamedTab } from './types';
import { getTabHash } from './utils';

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

  async function setCurTabHelper({
    newTab,
    deletedTab,
  }: {
    newTab?: NamedTab;
    deletedTab?: NamedTab;
  }) {
    if (newTab) {
      setCurTab(getTabHash(newTab));
    } else if (deletedTab) {
      if (deletedTab && currentTabs.length === 1) {
        setCurTab('home');
      }
      for (const tab of currentTabs) {
        if (getTabHash(tab) !== getTabHash(deletedTab)) {
          setCurTab(getTabHash(tab));
          break;
        }
      }
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
      newTab: {
        name: managementZoneName || 'Untitled Zone',
        managementZone: managementZoneId,
        id: maybeNewTab.data!.tabId,
        user: currentUser.id,
      },
    });
  }

  async function deleteTab(tab: NamedTab) {
    // Approved users always have at least 1 tab open
    if (currentTabs.length === 1 && currentUser.approved) {
      return;
    }

    const tabId = tab.id;
    const result = await deleteTabAction({ tabId });

    if (result.error) {
      logger.error(result.error);
      return;
    }

    router.refresh();

    setCurTabHelper({ deletedTab: tab });
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
      <div className="absolute top-4 left-40 max-w-[70vw] min-[107rem]:right-0 min-[107rem]:left-0 min-[107rem]:m-auto min-[107rem]:w-[107rem] min-[107rem]:max-w-300">
        <TabsList className="flex flex-row flex-nowrap justify-start gap-2 bg-transparent">
          {currentTabs.map((tab, index) => (
            <TabsTrigger
              className="group group flex max-w-36 min-w-36 flex-row items-center justify-between truncate border-none px-2 data-[state=active]:bg-gray-200"
              key={tab.id}
              value={getTabHash(tab)}
              onClick={() => setCurTabHelper({ newTab: tab })}
            >
              <input
                className="pointer-events-none max-w-25 cursor-pointer truncate group-data-[state=active]:pointer-events-auto focus:ring-0 focus:outline-none"
                defaultValue={tab.name || `Untitled Zone ${index}`}
                onChange={(e) => updateTab(e.target.value, tab.id)}
                onBlur={(e) => (e.target.scrollLeft = 0)}
              />
              {currentTabs.length !== 1 && (
                <div>
                  {/** This isn't the best solution, but it's the easiest way to nest buttons. Getting the entire background to render with a wrapping div via data-[state=active] is just a pain */}
                  <div
                    aria-roledescription="Close the current tab"
                    role="button"
                    onClick={() => deleteTab(tab)}
                    className="h-min p-0"
                  >
                    <X className="h-min w-4" />
                  </div>
                </div>
              )}
            </TabsTrigger>
          ))}
          {currentTabs.length <= maxTabs && (
            <NewTabDropdown
              managementZones={managementZones}
              addTab={createTab}
            >
              <Button className="ml-2 min-w-10 cursor-pointer border-none text-4xl font-light focus-visible:ring-0! focus-visible:ring-offset-0!">
                <span className="absolute top-[-3.5px]">+</span>
              </Button>
            </NewTabDropdown>
          )}
          <div className="grow"></div>
        </TabsList>
      </div>
      {children}
    </Tabs>
  );
}
