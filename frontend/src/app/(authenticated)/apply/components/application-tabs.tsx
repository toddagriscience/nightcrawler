// Copyright © Todd Agriscience, Inc. All rights reserved.

'use client';

import { Tabs, TabsList, TabsContent, TabsTrigger } from '@/components/ui/tabs';
import GeneralBusinessInformation from './general-business-information';
import Colleagues from './colleagues';
import Farm from './farm';
import { GeneralBusinessInformationUpdate, TabTypes } from '../types';
import { FarmInfoInternalApplicationSelect, User } from '@/lib/types/db';
import { useState } from 'react';

/** The tabs for the application */
export default function ApplicationTabs({
  farmInfo,
  allUsers,
  internalApplication,
}: {
  farmInfo: GeneralBusinessInformationUpdate;
  allUsers: User[];
  internalApplication: FarmInfoInternalApplicationSelect;
}) {
  const [currentTab, setCurrentTab] = useState<TabTypes>();

  return (
    <Tabs defaultValue="general" value={currentTab}>
      <TabsList className="flex h-auto flex-wrap items-center justify-start gap-3 bg-transparent max-md:mt-6">
        <TabsTrigger onClick={() => setCurrentTab('general')} value="general">
          General Business Information
        </TabsTrigger>
        <TabsTrigger
          onClick={() => setCurrentTab('colleagues')}
          value="colleagues"
        >
          Colleagues
        </TabsTrigger>
        <TabsTrigger onClick={() => setCurrentTab('farm')} value="farm">
          Farm Information
        </TabsTrigger>
        <TabsTrigger onClick={() => setCurrentTab('terms')} value="terms">
          Terms
        </TabsTrigger>
      </TabsList>

      <TabsContent value="general">
        <GeneralBusinessInformation
          defaultValues={{
            ...farmInfo,
          }}
          setCurrentTab={setCurrentTab}
        />
      </TabsContent>

      <TabsContent value="colleagues">
        <Colleagues allUsers={allUsers} setCurrentTab={setCurrentTab} />
      </TabsContent>

      <TabsContent value="farm">
        <Farm
          defaultValues={{ ...internalApplication, farmId: farmInfo.farmId! }}
          setCurrentTab={setCurrentTab}
        />
      </TabsContent>

      <TabsContent value="terms">{/* Terms content */}</TabsContent>
    </Tabs>
  );
}
