// Copyright © Todd Agriscience, Inc. All rights reserved.

import { getAuthenticatedInfo } from '@/lib/utils/get-authenticated-info';
import { hasAcceptedAccountAgreement } from '@/lib/utils/account-agreement';
import { redirect } from 'next/navigation';
import AccountAgreementPageContent from './components/account-agreement-page-content';

/** Agreement page that unblocks viewer accounts after acceptance. */
export default async function AccountAgreementPage() {
  const currentUser = await getAuthenticatedInfo();

  if (currentUser.role !== 'Viewer') {
    redirect('/');
  }

  const hasAccepted = await hasAcceptedAccountAgreement(currentUser.id);
  if (hasAccepted) {
    redirect('/');
  }

  return <AccountAgreementPageContent />;
}
