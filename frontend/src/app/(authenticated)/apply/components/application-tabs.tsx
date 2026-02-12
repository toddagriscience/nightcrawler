// Copyright © Todd Agriscience, Inc. All rights reserved.

'use client';

import { Tabs, TabsList, TabsContent, TabsTrigger } from '@/components/ui/tabs';
import GeneralBusinessInformation from './general-business-information';
import Colleagues from './colleagues';
import Farm from './farm';
import {
  GeneralBusinessInformationUpdate,
  TabTypes,
  VerificationStatus,
} from '../types';
import { FarmInfoInternalApplicationSelect, UserSelect } from '@/lib/types/db';
import { createContext, useState } from 'react';
import dynamic from 'next/dynamic';
const TermsAndConditions = dynamic(() => import('./terms-and-conditions'), {
  ssr: false,
});

export const ApplicationContext = createContext({
  farmInfo: {} as GeneralBusinessInformationUpdate,
  allUsers: [{} as UserSelect],
  currentUser: {} as UserSelect,
  internalApplication: {} as FarmInfoInternalApplicationSelect,
  invitedUserVerificationStatus: [{} as VerificationStatus],
});

/** The tabs for the application */
export default function ApplicationTabs({
  farmInfo,
  allUsers,
  internalApplication,
  currentUser,
  invitedUserVerificationStatus,
}: {
  farmInfo: GeneralBusinessInformationUpdate;
  allUsers: UserSelect[];
  currentUser: UserSelect;
  internalApplication: FarmInfoInternalApplicationSelect;
  invitedUserVerificationStatus: VerificationStatus[];
}) {
  const [currentTab, setCurrentTab] = useState<TabTypes>('general');

  return (
    <ApplicationContext.Provider
      value={{
        farmInfo,
        allUsers,
        internalApplication,
        currentUser,
        invitedUserVerificationStatus,
      }}
    >
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
          <Colleagues setCurrentTab={setCurrentTab} />
        </TabsContent>

        <TabsContent value="farm">
          <Farm
            defaultValues={{ ...internalApplication, farmId: farmInfo.farmId! }}
            setCurrentTab={setCurrentTab}
          />
        </TabsContent>

        <TabsContent value="terms">
          <TermsAndConditions />
        </TabsContent>
      </Tabs>
    </ApplicationContext.Provider>
  );
}
