// Copyright © Todd Agriscience, Inc. All rights reserved.

import type { UserSelect } from '@/lib/types/db';
import type { ReactNode } from 'react';

/** Values supplied to a bank setup form rendered within the payment step. */
export interface BankSetupFormProps {
  setupIntentId: string;
  onComplete: () => void;
}

/** Optional bank form renderer for isolated previews without Stripe. */
export interface BankInformationProps {
  renderSetupForm?: (props: BankSetupFormProps) => ReactNode;
}

/** A team member and the permissions for their onboarding controls. */
export interface InvitedUserProps {
  isVerified: boolean;
  invitedUser: UserSelect;
  isCurrentUser?: boolean;
  canEditFarm: boolean;
  onUninvited?: (userId: number) => void;
}
