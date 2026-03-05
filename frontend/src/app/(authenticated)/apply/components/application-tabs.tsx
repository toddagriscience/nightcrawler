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
import {
  FarmInfoInternalApplicationSelect,
  FarmSubscriptionSelect,
  UserSelect,
} from '@/lib/types/db';
import { createContext, useState } from 'react';
import dynamic from 'next/dynamic';
import Subscription from './subscription';
const TermsAndConditions = dynamic(() => import('./terms-and-conditions'), {
  ssr: false,
});

export const ApplicationContext = createContext({
  farmInfo: {} as GeneralBusinessInformationUpdate,
  allUsers: [{} as UserSelect],
  currentUser: {} as UserSelect,
  internalApplication: {} as FarmInfoInternalApplicationSelect,
  farmSubscription: null as FarmSubscriptionSelect | null,
  invitedUserVerificationStatus: [{} as VerificationStatus],
  setCurrentTab: (_tab: TabTypes) => {},
  canSubmitApplication: false,
});

/** The tabs for the application */
export default function ApplicationTabs({
  farmInfo,
  allUsers,
  internalApplication,
  farmSubscription,
  currentUser,
  invitedUserVerificationStatus,
  canSubmitApplication,
}: {
  farmInfo: GeneralBusinessInformationUpdate;
  allUsers: UserSelect[];
  currentUser: UserSelect;
  internalApplication: FarmInfoInternalApplicationSelect;
  farmSubscription: FarmSubscriptionSelect | null;
  invitedUserVerificationStatus: VerificationStatus[];
  canSubmitApplication: boolean;
}) {
  const [currentTab, setCurrentTab] = useState<TabTypes>('general');
  const hasActiveSubscription = ['active', 'trialing'].includes(
    farmSubscription?.status ?? ''
  );

  return (
    <ApplicationContext.Provider
      value={{
        farmInfo,
        allUsers,
        internalApplication,
        farmSubscription,
        currentUser,
        invitedUserVerificationStatus,
        setCurrentTab,
        canSubmitApplication,
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
          <TabsTrigger
            onClick={() => setCurrentTab('subscription')}
            value="subscription"
          >
            Subscription
          </TabsTrigger>
          <TabsTrigger value="terms" onClick={() => setCurrentTab('terms')}>
            Terms
          </TabsTrigger>
        </TabsList>

        <TabsContent value="general">
          <GeneralBusinessInformation />
        </TabsContent>

        <TabsContent value="colleagues">
          <Colleagues />
        </TabsContent>

        <TabsContent value="farm">
          <Farm />
        </TabsContent>

        <TabsContent value="subscription">
          <Subscription />
        </TabsContent>

        <TabsContent value="terms">
          <TermsAndConditions />
        </TabsContent>
      </Tabs>
    </ApplicationContext.Provider>
  );
}
