// Copyright © Todd Agriscience, Inc. All rights reserved.

import type { Meta, StoryObj } from '@storybook/react-vite';
import OnboardingFlow from '@/app/(onboarding)/apply/components/onboarding-flow';
import {
  ONBOARDING_ACTIONS,
  ONBOARDING_DATA,
} from '@/app/(onboarding)/apply/components/onboarding-fixtures';

const meta = {
  title: 'Onboarding/Flow',
  component: OnboardingFlow,
  args: { data: ONBOARDING_DATA, actions: ONBOARDING_ACTIONS },
  parameters: {
    layout: 'fullscreen',
    nextjs: { navigation: { pathname: '/apply' } },
  },
} satisfies Meta<typeof OnboardingFlow>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Password: Story = {
  render: () => (
    <OnboardingFlow
      applicant={{
        applicationId: 42,
        token: 'preview-token',
        email: 'alex@example.com',
      }}
      actions={ONBOARDING_ACTIONS}
    />
  ),
};
export const Team: Story = {};
export const Payment: Story = {
  args: { data: { ...ONBOARDING_DATA, initialStep: 'payment' } },
};
export const PaymentSaved: Story = {
  args: {
    data: { ...ONBOARDING_DATA, initialStep: 'payment', hasBankSetup: true },
  },
};
export const Terms: Story = {
  args: {
    data: {
      ...ONBOARDING_DATA,
      initialStep: 'terms',
      hasBankSetup: true,
      paymentContinued: true,
      canSubmitApplication: true,
    },
  },
};
