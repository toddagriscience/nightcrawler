// Copyright © Todd Agriscience, Inc. All rights reserved.

import type {
  OnboardingActions,
  OnboardingContextValue,
  OnboardingData,
} from '@/app/(onboarding)/apply/types';

/** Fictional main applicant shared by isolated onboarding tests and stories. */
export const ONBOARDING_DATA: OnboardingData = {
  currentUser: {
    id: 1,
    farmId: 1,
    firstName: 'Alex',
    lastName: 'Rivera',
    email: 'alex@example.com',
    phone: null,
    job: 'Farm owner',
    role: 'Admin',
    didOwnAndControlParcel: true,
    didManageAndControl: false,
    createdAt: new Date('2026-09-01T12:00:00Z'),
    updatedAt: new Date('2026-09-01T12:00:00Z'),
    approved: false,
  },
  farmInfo: { id: 1, businessName: 'Rivera Farm' },
  allUsers: [],
  farmSubscription: null,
  invitedUserVerificationStatus: [],
  initialStep: 'team',
  hasBankSetup: false,
  paymentContinued: false,
  canSubmitApplication: false,
};

/** Local action fakes that never send invitations or contact Stripe. */
export const ONBOARDING_ACTIONS: OnboardingActions = {
  signUp: async () => ({}),
  completeTeamStep: async () => ({}),
  completePaymentStep: async () => ({}),
  goBackToTeam: async () => ({}),
  inviteUserToFarm: async (input) => ({
    data: {
      ...input,
      id: 2,
      farmId: 1,
      createdAt: new Date('2026-09-01T12:00:00Z'),
      updatedAt: new Date('2026-09-01T12:00:00Z'),
    },
  }),
  resendVerificationEmail: async () => ({}),
  uninviteUser: async () => ({}),
  createAchSetupIntent: async () => ({
    data: { clientSecret: 'preview-secret', setupIntentId: 'preview-setup' },
  }),
  recordAchSetupComplete: async () => ({}),
  submitApplication: async () => ({}),
};

/** Default context for isolated step previews; callers override the active state. */
export const ONBOARDING_CONTEXT: OnboardingContextValue = {
  ...ONBOARDING_DATA,
  canEditFarm: true,
  actions: ONBOARDING_ACTIONS,
  completeTeamStep: async () => {},
  completePaymentStep: async () => {},
  goBackToTeam: async () => {},
  onBankSetupComplete: () => {},
};
