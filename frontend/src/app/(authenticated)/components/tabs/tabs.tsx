// Copyright © Todd Agriscience, Inc. All rights reserved.

'use client';

import ToddHeader from '@/components/common/wordmark/todd-wordmark';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import logger from '@/lib/logger';
import { ManagementZoneSelect } from '@/lib/types/db';
import type { AuthenticatedInfo } from '@/lib/types/get-authenticated-info';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { BiPlus, BiX } from 'react-icons/bi';
import updateTabName, {
  createTab as createTabAction,
  deleteTab as deleteTabAction,
} from './actions';
import TabCloseButton from './components/tab-close-button';
import NewTabDropdown from './new-tab-dropdown';
import { NamedTab } from './types';
import { getTabHash } from './utils';
import { SearchNavForm } from '@/components/common/authenticated-header/components/search-nav-form';

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
  const canEditFarm = currentUser.role === 'Admin';
  const selectedTabIndex = currentTabs.findIndex(
    (tab) => getTabHash(tab) === curTab
  );
  const selectedTab = currentTabs[selectedTabIndex] ?? currentTabs[0];

  // Set the title of the page based on the current tab.
  useEffect(() => {
    const fallbackTabName =
      selectedTabIndex >= 0 ? `Untitled Zone ${selectedTabIndex}` : 'Home';
    document.title = `${selectedTab?.name || fallbackTabName} | Todd`;
  }, [selectedTab, selectedTabIndex]);

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
        className="flex w-full max-w-540 flex-row items-center justify-between px-3 pt-3"
        role="banner"
      >
        <ToddHeader className="flex scale-90 flex-row items-center" />
        <TabsList className="mr-auto ml-2 flex h-9 flex-row flex-nowrap justify-start gap-0 bg-gradient-to-r from-[#D9D9D9]/10 to-[#D9D9D9]/0">
          {currentTabs.map((tab, index) => (
            <div key={tab.id} className="group relative">
              <TabsTrigger
                className="group/tab flex max-w-36 min-w-36 flex-row items-center justify-center truncate border-none px-3 py-1.5 pr-8 data-[state=active]:bg-[#D9D9D9]/32"
                value={getTabHash(tab)}
                onClick={() => {
                  const nextTabHash = getTabHash(tab);
                  setTab(nextTabHash);
                }}
              >
                <input
                  className="pointer-events-none max-w-25 cursor-pointer truncate text-center group-data-[state=active]/tab:pointer-events-auto focus:ring-0 focus:outline-none"
                  defaultValue={tab.name || `Untitled Zone ${index}`}
                  data-readonly={!canEditFarm}
                  readOnly={!canEditFarm}
                  onChange={(e) => updateTab(e.target.value, tab.id)}
                  onBlur={(e) => (e.target.scrollLeft = 0)}
                />
              </TabsTrigger>
              {canEditFarm && currentTabs.length !== 1 ? (
                <TabCloseButton
                  onClose={() => deleteTab(tab)}
                  tabName={tab.name || `Untitled Zone ${index}`}
                  visible={curTab === getTabHash(tab)}
                />
              ) : null}
            </div>
          ))}
          {canEditFarm && currentTabs.length < maxTabs && (
            <NewTabDropdown
              managementZones={managementZones}
              addTab={createTab}
            />
          )}
        </TabsList>
        <div className="flex flex-row items-center gap-6 border-none">
          {currentUser.approved ? <SearchNavForm /> : null}
          {addWidgetDropdown}
          {header}
        </div>
      </header>
      {children}
    </Tabs>
  );
}
