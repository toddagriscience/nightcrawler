// Copyright © Todd Agriscience, Inc. All rights reserved.

'use client';

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  FarmInfoInternalApplicationSelect,
  FarmSubscriptionSelect,
  UserSelect,
} from '@/lib/types/db';
import dynamic from 'next/dynamic';
import { createContext, useState } from 'react';
import {
  GeneralBusinessInformationUpdate,
  TabTypes,
  VerificationStatus,
} from '../types';
import BankInformation from './bank-information';
import Colleagues from './colleagues';

const TermsAndConditions = dynamic(() => import('./terms-and-conditions'), {
  ssr: false,
});

/** Slim onboarding tabs shown to new clients after signup. */
export const SLIM_ONBOARDING_TABS = [
  'colleagues',
  'bank-information',
  'terms',
] as const satisfies readonly TabTypes[];

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
  nextTabAfterColleagues: 'bank-information' as TabTypes,
});

/** Slim post-signup onboarding: colleagues, bank, terms. */
export default function ApplicationTabs({
  farmInfo,
  allUsers,
  internalApplication = {} as FarmInfoInternalApplicationSelect,
  farmSubscription,
  currentUser,
  invitedUserVerificationStatus,
  canSubmitApplication,
}: {
  farmInfo: GeneralBusinessInformationUpdate;
  allUsers: UserSelect[];
  currentUser: UserSelect;
  internalApplication?: FarmInfoInternalApplicationSelect;
  farmSubscription: FarmSubscriptionSelect | null;
  invitedUserVerificationStatus: VerificationStatus[];
  canSubmitApplication: boolean;
}) {
  const hasBankSetup = ['bank_setup_complete', 'active', 'trialing'].includes(
    farmSubscription?.status ?? ''
  );
  const [currentTab, setCurrentTab] = useState<TabTypes>(() =>
    hasBankSetup ? 'terms' : 'colleagues'
  );
  const canEditFarm = currentUser.role === 'Admin';

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
        nextTabAfterColleagues: 'bank-information',
      }}
    >
      <Tabs defaultValue="colleagues" value={currentTab}>
        {!canEditFarm && (
          <p className="mt-6 rounded-md border border-amber-400/60 bg-amber-50 p-3 text-sm text-amber-800">
            Your account is read only. Only administrators can invite colleagues
            or complete onboarding.
          </p>
        )}
        <TabsList className="flex h-auto flex-wrap items-center justify-start gap-3 bg-transparent max-md:mt-6">
          <TabsTrigger
            onClick={() => setCurrentTab('colleagues')}
            value="colleagues"
          >
            Colleagues
          </TabsTrigger>
          <TabsTrigger
            onClick={() => setCurrentTab('bank-information')}
            value="bank-information"
          >
            Bank Information
          </TabsTrigger>
          <TabsTrigger value="terms" onClick={() => setCurrentTab('terms')}>
            Terms
          </TabsTrigger>
        </TabsList>

        <TabsContent value="colleagues">
          <Colleagues />
        </TabsContent>

        <TabsContent value="bank-information">
          <BankInformation />
        </TabsContent>

        <TabsContent value="terms">
          <TermsAndConditions />
        </TabsContent>
      </Tabs>
    </ApplicationContext.Provider>
  );
}
