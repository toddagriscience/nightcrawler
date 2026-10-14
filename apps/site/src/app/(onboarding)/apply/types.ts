// Copyright © Todd Agriscience, Inc. All rights reserved.

import {
  farmCertificateInsertSchema,
  farmCertificateSelectSchema,
  farmCertificateUpdateSchema,
  farmInsertSchema,
  farmLocationInsertSchema,
  farmLocationSelectSchema,
  farmLocationUpdateSchema,
  farmSelectSchema,
  farmUpdateSchema,
} from '@/lib/zod-schemas/db';
import z from 'zod';
import type { ActionResponse } from '@/lib/types/action-response';
import type {
  FarmSubscriptionSelect,
  UserInsert,
  UserSelect,
} from '@/lib/types/db';
import type { AuthenticatedInfo } from '@/lib/types/get-authenticated-info';

/** Validation retained for server-side farm information updates. */
export const generalBusinessInformationInsertSchema = z
  .intersection(
    farmLocationInsertSchema,
    z.intersection(farmCertificateInsertSchema, farmInsertSchema)
  )
  .and(
    z.object({
      hasAddress: z.enum(['yes', 'no'], {
        message: 'Please select Yes or No.',
      }),
    })
  )
  .superRefine((data, ctx) => {
    const anyChecked = [
      data.hasGAP,
      data.hasLocalInspection,
      data.hasOrganic,
      data.hasBiodynamic,
      data.hasRegenerativeOrganic,
      data.hasNone,
    ].some(Boolean);

    if (!anyChecked) {
      ctx.addIssue({
        code: 'custom',
        message: 'Select at least one certification.',
        path: ['certifications'],
      });
    }

    if (data.hasAddress === 'yes') {
      (['address1', 'state', 'postalCode', 'country'] as const).forEach(
        (key) => {
          if (!data[key]?.trim()) {
            ctx.addIssue({
              code: 'custom',
              message: 'This field is required.',
              path: [key],
            });
          }
        }
      );
    }

    if (data.hasAddress === 'no') {
      (['countyState', 'apn'] as const).forEach((key) => {
        if (!data[key]?.trim()) {
          ctx.addIssue({
            code: 'custom',
            message: 'This field is required.',
            path: [key],
          });
        }
      });
    }
  });

/** Combined farm, address, and certification data read from the database. */
export const generalBusinessInformationSelectSchema = z.intersection(
  farmLocationSelectSchema,
  z.intersection(farmCertificateSelectSchema, farmSelectSchema)
);

/** Partial fields accepted when updating farm information. */
export const generalBusinessInformationUpdateSchema = z.intersection(
  farmLocationUpdateSchema,
  z.intersection(farmCertificateUpdateSchema, farmUpdateSchema)
);

/** Validated values for saving farm information. */
export type GeneralBusinessInformationInsert = z.infer<
  typeof generalBusinessInformationInsertSchema
>;

/** Combined farm information returned from storage. */
export type GeneralBusinessInformationSelect = z.infer<
  typeof generalBusinessInformationSelectSchema
>;

/** Partial farm information available to onboarding components. */
export type GeneralBusinessInformationUpdate = z.infer<
  typeof generalBusinessInformationUpdateSchema
>;

/** Verification information shown alongside an invited teammate. */
export type VerificationStatus = { email: string; verified: boolean };

/** The four steps in approved-applicant account setup. */
export type OnboardingStep = 'password' | 'team' | 'payment' | 'terms';

/** Persisted facts used to resume onboarding after a reload or Stripe return. */
export interface OnboardingState {
  passwordSet: boolean;
  teamStepDone: boolean;
  bankReady: boolean;
  paymentContinued: boolean;
  termsAccepted: boolean;
}

/** Data needed by the password form before the applicant has a farm record. */
export interface OnboardingApplicant {
  applicationId: number;
  token: string;
  email: string;
  passwordSet?: boolean;
}

/** Authenticated, server-loaded information for the remaining onboarding steps. */
export interface OnboardingData {
  currentUser: AuthenticatedInfo;
  farmInfo: GeneralBusinessInformationUpdate;
  allUsers: UserSelect[];
  farmSubscription: FarmSubscriptionSelect | null;
  invitedUserVerificationStatus: VerificationStatus[];
  initialStep: Exclude<OnboardingStep, 'password'>;
  hasBankSetup: boolean;
  paymentContinued: boolean;
  canSubmitApplication: boolean;
  returnedSetupIntentId?: string;
}

/** Server actions injected into the flow; stories supply side-effect-free fakes. */
export interface OnboardingActions {
  signUp: (
    initialState: unknown,
    formData: FormData
  ) => Promise<ActionResponse>;
  completeTeamStep: () => Promise<ActionResponse>;
  completePaymentStep: () => Promise<ActionResponse>;
  goBackToTeam: () => Promise<ActionResponse>;
  inviteUserToFarm: (input: UserInsert) => Promise<ActionResponse>;
  resendVerificationEmail: (email: string) => Promise<ActionResponse>;
  uninviteUser: (userId: number) => Promise<ActionResponse>;
  createAchSetupIntent: () => Promise<ActionResponse>;
  recordAchSetupComplete: (setupIntentId: string) => Promise<ActionResponse>;
  submitApplication: () => Promise<ActionResponse>;
}

/** Values available to the team, payment, and terms components. */
export interface OnboardingContextValue extends Omit<
  OnboardingData,
  'initialStep'
> {
  canEditFarm: boolean;
  actions: OnboardingActions;
  completeTeamStep: () => Promise<void>;
  completePaymentStep: () => Promise<void>;
  goBackToTeam: () => Promise<void>;
  onBankSetupComplete: () => void;
}

/** Props shared by the real onboarding page and its interactive stories. */
export type OnboardingFlowProps = {
  actions: OnboardingActions;
} & (
  | { applicant: OnboardingApplicant; data?: never }
  | { applicant?: never; data: OnboardingData }
);
