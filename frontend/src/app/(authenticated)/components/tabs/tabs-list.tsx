// Copyright © Todd Agriscience, Inc. All rights reserved.

'use client';

import { TabsList, TabsTrigger } from '@/components/ui/tabs';
import { NamedTab } from './types';
import { Button } from '@/components/ui';
import { getTabHash } from './helpers';
import { useState } from 'react';
import { ManagementZoneSelect, UserSelect } from '@/lib/types/db';
import { createTab } from './actions';
import logger from '@/lib/logger';
import { formatActionResponseErrors } from '@/lib/utils/actions';
import NewTabDropdown from './new-tab-dropdown';

const maxTabs = 8;

export default function PlatformTabsList({
  currentTabs,
  managementZones,
  currentUser,
}: {
  currentTabs: NamedTab[];
  managementZones: ManagementZoneSelect[];
  currentUser: UserSelect;
}) {
  const [tabs, setTabs] = useState(currentTabs);
  const [zones, setZones] = useState(managementZones);

  async function addTab(
    managementZoneId: number,
    managementZoneName: string | null
  ) {
    const maybeNewTab = await createTab(managementZoneId);

    const errors = formatActionResponseErrors(maybeNewTab);

    if (errors.length !== 0 || !maybeNewTab.data) {
      logger.error(errors);
      return;
    }

    const newTab: NamedTab = {
      managementZone: managementZoneId,
      name: managementZoneName,
      user: currentUser.id,
      // This is safe, createTab is guaranteed to return a number in tabId
      id: maybeNewTab.data.tabId! as number,
    };

    setTabs([...tabs, newTab]);

    // Remove added management zone from list
    const newManagementZones = zones.filter(
      (zone) => zone.farmId !== managementZoneId
    );
    setZones(newManagementZones);
  }

  return (
    <div className="absolute left-40 top-4 min-[107rem]:w-[107rem] min-[107rem]:left-0 min-[107rem]:right-0 min-[107rem]:m-auto  max-w-[70vw] min-[107rem]:max-w-350">
      <TabsList className="bg-transparent flex flex-row flex-nowrap gap-2 justify-start">
        {!tabs.length ? (
          <TabsTrigger
            value="home"
            className="border-none data-[state=active]:bg-gray-200 flex-1  overflow-hidden text-ellipsis whitespace-nowrap max-w-56 truncate text-left w-36"
          >
            Home
          </TabsTrigger>
        ) : (
          tabs.map((tab, index) => (
            <TabsTrigger
              className="border-none data-[state=active]:bg-gray-200 max-w-36 truncate min-w-36 group"
              key={tab.id}
              value={getTabHash(tab)}
            >
              <input
                className="cursor-pointer max-w-[100%] text-center group-data-[state=active]:pointer-events-none outline-none ring-0 focus:outline-none focus:ring-0"
                defaultValue={tab.name || `Untitled Zone ${index}`}
              />
            </TabsTrigger>
          ))
        )}
        {tabs.length <= maxTabs && (
          <NewTabDropdown managementZones={zones} addTab={addTab}>
            <Button className="cursor-pointer text-4xl font-light ml-2 min-w-10">
              <span className="absolute top-[-3.5px]">+</span>
            </Button>
          </NewTabDropdown>
        )}
        <div className="grow"></div>
      </TabsList>
    </div>
  );
}
