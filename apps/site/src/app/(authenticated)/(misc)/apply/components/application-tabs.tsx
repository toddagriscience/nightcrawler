// Copyright © Todd Agriscience, Inc. All rights reserved.

'use client';

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  FarmInfoInternalApplicationSelect,
  FarmSubscriptionSelect,
  UserSelect,
} from '@/lib/types/db';
import dynamic from 'next/dynamic';
import { createContext, useEffect, useState } from 'react';
import {
  GeneralBusinessInformationUpdate,
  TabTypes,
  VerificationStatus,
} from '../types';
import Colleagues from './colleagues';
import Farm from './farm';
import GeneralBusinessInformation from './general-business-information';
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
  canEditFarm: false,
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
  const canEditFarm = currentUser.role === 'Admin';

  useEffect(() => {
    async function helper() {
      if (hasActiveSubscription) {
        setCurrentTab('terms');
      }
    }
    helper();
  }, [setCurrentTab, hasActiveSubscription]);

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
        canEditFarm,
      }}
    >
      <Tabs defaultValue="general" value={currentTab}>
        {!canEditFarm && (
          <p className="mt-6 rounded-md border border-amber-400/60 bg-amber-50 p-3 text-sm text-amber-800">
            Your account is read only. Only administrators can edit farm
            information or submit the application.
          </p>
        )}
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
            Platform License
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
