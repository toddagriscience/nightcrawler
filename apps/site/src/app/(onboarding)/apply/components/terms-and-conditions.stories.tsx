// Copyright © Todd Agriscience, Inc. All rights reserved.

import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, userEvent, waitFor, within } from 'storybook/test';
import TermsAndConditions from '@/app/(onboarding)/apply/components/terms-and-conditions';
import { ApplicationContext } from '@/app/(onboarding)/apply/components/onboarding-context';
import { ONBOARDING_CONTEXT } from '@/app/(onboarding)/apply/components/onboarding-fixtures';
import type { OnboardingContextValue } from '@/app/(onboarding)/apply/types';

const meta = {
  title: 'Onboarding/Terms and Conditions',
  component: TermsAndConditions,
  tags: ['autodocs'],
  decorators: [
    (Story, context) => (
      <ApplicationContext.Provider
        value={{
          ...ONBOARDING_CONTEXT,
          hasBankSetup: true,
          paymentContinued: true,
          canSubmitApplication: true,
          ...(context.parameters.onboardingContext as
            Partial<OnboardingContextValue> | undefined),
        }}
      >
        <div className="mx-auto max-w-3xl p-8">
          <Story />
        </div>
      </ApplicationContext.Provider>
    ),
  ],
} satisfies Meta<typeof TermsAndConditions>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const Confirmation: Story = {
  play: async ({ canvasElement }) => {
    await userEvent.click(
      within(canvasElement).getByRole('button', { name: /^Agree$/ })
    );
  },
};
export const SubmissionError: Story = {
  parameters: {
    onboardingContext: {
      actions: {
        ...ONBOARDING_CONTEXT.actions,
        submitApplication: async () => {
          throw new Error('Unable to submit. Please try again.');
        },
      },
    },
  },
  play: async (context) => {
    await Confirmation.play?.(context);
    const page = within(context.canvasElement.ownerDocument.body);
    const submit = page.getByRole('button', { name: 'Agree and submit' });
    await waitFor(() => expect(submit).toBeEnabled(), { timeout: 6500 });
    await userEvent.click(submit);
    await expect(await page.findByRole('alert')).toHaveTextContent(
      'There was an error submitting your application.'
    );
  },
};
export const ReadOnly: Story = {
  parameters: { onboardingContext: { canEditFarm: false } },
};
export const AwaitingConfirmation: Story = {
  parameters: { onboardingContext: { canSubmitApplication: false } },
};
export const PaymentNotContinued: Story = {
  parameters: { onboardingContext: { paymentContinued: false } },
};

export const BankVerificationUnavailable: Story = {
  parameters: { onboardingContext: { hasBankSetup: false } },
};
