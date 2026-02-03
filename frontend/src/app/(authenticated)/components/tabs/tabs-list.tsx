// Copyright © Todd Agriscience, Inc. All rights reserved.

'use client';

import { TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Tab } from './types';
import { Button } from '@/components/ui';
import { getTabHash } from './helpers';

export default function PlatformTabsList({
  currentTabs,
}: {
  currentTabs: Tab[];
}) {
  return (
    <div className="absolute left-40 top-4 min-[107rem]:w-[107rem] min-[107rem]:left-0 min-[107rem]:right-0 min-[107rem]:m-auto  max-w-[70vw] min-[107rem]:max-w-350">
      <TabsList className="bg-transparent flex flex-row flex-nowrap gap-2 justify-start">
        {!currentTabs.length ? (
          <TabsTrigger
            value="home"
            className="border-none data-[state=active]:bg-gray-200 flex-1  overflow-hidden text-ellipsis whitespace-nowrap max-w-56 truncate text-left w-36"
          >
            Home
          </TabsTrigger>
        ) : (
          currentTabs.map((tab, index) => (
            <TabsTrigger
              className="border-none data-[state=active]:bg-gray-200 max-w-36 truncate min-w-36"
              key={tab.id}
              value={getTabHash(tab)}
            >
              <input
                className="cursor-pointer max-w-[100%] h-4 outline-none ring-0 focus:outline-none focus:ring-0"
                defaultValue={tab.name || `Untitled Zone ${index}`}
              />
            </TabsTrigger>
          ))
        )}
        <Button className="cursor-pointer text-4xl font-light ml-2 min-w-10">
          <span className="absolute top-[-3.5px]">+</span>
        </Button>
        <div className="grow"></div>
      </TabsList>
    </div>
  );
}
