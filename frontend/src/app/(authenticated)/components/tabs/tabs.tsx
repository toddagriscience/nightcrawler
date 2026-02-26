// Copyright © Todd Agriscience, Inc. All rights reserved.

'use client';

import AddWidgetDropdown from '@/components/common/widgets/add-widget-dropdown';
import ToddHeader from '@/components/common/wordmark/todd-wordmark';
import { Button } from '@/components/ui';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import logger from '@/lib/logger';
import { ManagementZoneSelect, UserSelect } from '@/lib/types/db';
import { X } from 'lucide-react';
import Link from 'next/link';
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
  children:
    | React.ReactNode
    | ((controls: {
        showDotGrid: boolean;
        onShowDotGrid: () => void;
        onHideDotGrid: () => void;
      }) => React.ReactNode);
}) {
  const router = useRouter();
  const [showDotGrid, setShowDotGrid] = useState(false);
  const [curTab, setCurTab] = useState(
    currentTabs.length !== 0 ? getTabHash(currentTabs[0]) : 'home'
  );
  const activeTab = currentTabs.find((tab) => getTabHash(tab) === curTab);

  function setCurTabHelper({ newTab }: { newTab?: NamedTab }) {
    if (newTab) {
      setCurTab(getTabHash(newTab));
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
    if (currentTabs.length === 1 && currentUser.approved) {
      return;
    }

    const result = await deleteTabAction({ tabId: tab.id });

    if (result.error) {
      logger.error(result.error);
      return;
    }

    router.refresh();

    const fallbackTab = currentTabs.find((t) => t.id !== tab.id);
    if (fallbackTab) {
      setCurTab(getTabHash(fallbackTab));
    } else {
      setCurTab('home');
    }
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
    <Tabs
      value={curTab}
      className="platform-dashboard-gradient flex h-screen flex-col overflow-hidden"
    >
      <div className="h-14 px-5">
        <div className="flex h-full items-center gap-4">
          <ToddHeader className="flex min-h-8 flex-row items-center [&>img]:h-auto [&>img]:w-[68px]" />
          <TabsList className="flex h-auto max-w-[42vw] flex-1 flex-row flex-nowrap justify-start gap-2 overflow-hidden bg-transparent p-0">
            {currentTabs.map((tab, index) => (
              <TabsTrigger
                className="group flex h-9 max-w-40 min-w-28 flex-row items-center justify-between truncate border-none px-3 text-[14px] leading-none data-[state=active]:bg-gray-200 data-[state=active]:shadow-none"
                key={tab.id}
                value={getTabHash(tab)}
                onClick={() => setCurTabHelper({ newTab: tab })}
              >
                <input
                  className="pointer-events-none max-w-25 cursor-pointer truncate text-[14px] leading-none group-data-[state=active]:pointer-events-auto focus:ring-0 focus:outline-none"
                  defaultValue={tab.name || `Untitled Zone ${index}`}
                  onChange={(e) => updateTab(e.target.value, tab.id)}
                  onBlur={(e) => (e.target.scrollLeft = 0)}
                />
                {currentTabs.length > 1 && (
                  <button
                    type="button"
                    aria-label="Delete tab"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      deleteTab(tab);
                    }}
                    className="ml-2 cursor-pointer p-0 text-foreground/80 hover:text-foreground"
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                )}
              </TabsTrigger>
            ))}
            {currentTabs.length <= maxTabs && (
              <NewTabDropdown
                managementZones={managementZones}
                addTab={createTab}
              >
                <Button className="h-9 min-w-8 cursor-pointer border-none px-2 text-[22px] leading-none font-light text-muted-foreground focus-visible:ring-0! focus-visible:ring-offset-0!">
                  <span>+</span>
                </Button>
              </NewTabDropdown>
            )}
          </TabsList>
          {activeTab && (
            <AddWidgetDropdown
              managementZoneId={activeTab.managementZone}
              onOpenChange={setShowDotGrid}
              onWidgetSelected={() => setShowDotGrid(false)}
            >
              <Button
                size="sm"
                variant="outline"
                className="h-9 rounded-md border-none bg-gray-200 px-4 text-[14px] leading-none hover:cursor-pointer hover:bg-gray-200"
              >
                Add widget
              </Button>
            </AddWidgetDropdown>
          )}
          <div className="ml-2 flex items-center gap-8 text-[14px] leading-none">
            <div className="text-[14px] leading-none">Notifications</div>
            <Link href="/account" className="text-[14px] leading-none">
              Account
            </Link>
          </div>
        </div>
      </div>
      <div className="min-h-0 flex-1 overflow-hidden">
        {typeof children === 'function'
          ? children({
              showDotGrid,
              onShowDotGrid: () => setShowDotGrid(true),
              onHideDotGrid: () => setShowDotGrid(false),
            })
          : children}
      </div>
    </Tabs>
  );
}
