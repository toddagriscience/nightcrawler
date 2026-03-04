// Copyright © Todd Agriscience, Inc. All rights reserved.

'use client';

import ToddHeader from '@/components/common/wordmark/todd-wordmark';
import { Button } from '@/components/ui';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import logger from '@/lib/logger';
import { ManagementZoneSelect } from '@/lib/types/db';
import type { AuthenticatedInfo } from '@/lib/types/get-authenticated-info';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useState } from 'react';
import { BiPlus, BiX } from 'react-icons/bi';
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
  selectedTabHash,
  header,
  addWidgetDropdown,
  children,
}: {
  currentTabs: NamedTab[];
  currentUser: AuthenticatedInfo;
  managementZones: ManagementZoneSelect[];
  selectedTabHash: string;
  header: React.ReactNode;
  addWidgetDropdown: React.ReactNode;
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [curTab, setCurTab] = useState(selectedTabHash);

  /** Sets the current tab */
  function setTab(nextTabHash: string) {
    setCurTab(nextTabHash);
    const params = new URLSearchParams(searchParams.toString());
    params.set('tab', nextTabHash);
    router.replace(`${pathname}?${params.toString()}`, { scroll: false });
  }

  /** Updates information about the tab */
  async function updateTab(newName: string, tabId: number) {
    const result = await updateTabName({ newName, tabId });

    if (result.error) {
      logger.error(result.error);
      return;
    }

    router.refresh();
  }

  async function createTab(managementZoneId: number) {
    const maybeNewTab = await createTabAction(managementZoneId);

    if (maybeNewTab.error) {
      logger.error(maybeNewTab.error);
      return;
    }

    const nextTabHash = String(maybeNewTab.data!.tabId);
    setTab(nextTabHash);
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

    const remainingTabs = currentTabs.filter(
      (existingTab) => existingTab.id !== tab.id
    );
    const fallbackTabHash = remainingTabs[0]
      ? getTabHash(remainingTabs[0])
      : 'home';

    setTab(fallbackTabHash);
  }

  return (
    <Tabs value={curTab} className="h-[calc(100vh-5rem)]">
      <header
        className="w-full flex flex-row justify-between px-8 max-w-440 pt-3 items-center mx-auto"
        role="banner"
      >
        <ToddHeader className="flex flex-row items-center scale-70" />
        <TabsList className="flex flex-row flex-nowrap justify-start gap-2 bg-gradient-to-r from-[#D9D9D9]/15 to-[#D9D9D9]/0 mr-auto ml-4">
          {currentTabs.map((tab, index) => (
            <TabsTrigger
              className="group group flex max-w-38 min-w-38 flex-row items-center justify-between truncate border-none px-2 py-2 data-[state=active]:bg-[#D9D9D9]/32 data-[state=active]:shadow-sm"
              key={tab.id}
              value={getTabHash(tab)}
              onClick={() => {
                const nextTabHash = getTabHash(tab);
                setTab(nextTabHash);
              }}
            >
              <input
                className="pointer-events-none max-w-25 cursor-pointer truncate group-data-[state=active]:pointer-events-auto focus:ring-0 focus:outline-none "
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
                    className="h-min p-0 hover:bg-foreground/5 rounded-md mr-[-5px] translate-y-[-3px] hidden group-hover:block"
                  >
                    <BiX className="size-5 text-foreground/40" />
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
              <Button className="ml-1 cursor-pointer border-none focus-visible:ring-0! focus-visible:ring-offset-0! p-0 h-fit w-fit leading-none [&_svg]:size-[28px] hover:bg-foreground/5 rounded-md ">
                <BiPlus size={25} className="text-foreground/50" />
              </Button>
            </NewTabDropdown>
          )}
        </TabsList>
        <div className="flex-row flex gap-6 border-none pl-6">
          {addWidgetDropdown}
          {header}
        </div>
      </header>
      {children}
    </Tabs>
  );
}
