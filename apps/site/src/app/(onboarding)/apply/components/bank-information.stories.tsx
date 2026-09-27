// Copyright © Todd Agriscience, Inc. All rights reserved.

import type { Meta, StoryObj } from '@storybook/react-vite';
import { userEvent, within } from 'storybook/test';
import BankInformation from '@/app/(onboarding)/apply/components/bank-information';
import { ApplicationContext } from '@/app/(onboarding)/apply/components/onboarding-context';
import { ONBOARDING_CONTEXT } from '@/app/(onboarding)/apply/components/onboarding-fixtures';
import type { OnboardingContextValue } from '@/app/(onboarding)/apply/types';
import { Button } from '@/components/ui';
import { Input } from '@/components/ui/input';
import { useFormContext } from 'react-hook-form';

function PendingBankSetup() {
  const {
    handleSubmit,
    formState: { isSubmitting },
  } = useFormContext();
  return (
    <form
      onSubmit={handleSubmit(() => new Promise<void>(() => {}))}
      className="space-y-4"
    >
      <label htmlFor="pending-bank-account">Connected bank account</label>
      <Input id="pending-bank-account" value="Test bank •••• 6789" readOnly />
      <Button type="submit" disabled={isSubmitting}>
        {isSubmitting ? 'Saving…' : 'Save Bank Information'}
      </Button>
    </form>
  );
}

const meta = {
  title: 'Onboarding/Bank Information',
  component: BankInformation,
  tags: ['autodocs'],
  args: {
    renderSetupForm: ({ onComplete }) => (
      <div className="space-y-4">
        <label htmlFor="preview-bank-account">Connected bank account</label>
        <Input id="preview-bank-account" value="Test bank •••• 6789" readOnly />
        <Button type="button" onClick={onComplete}>
          Save Bank Information
        </Button>
      </div>
    ),
  },
  decorators: [
    (Story, context) => (
      <ApplicationContext.Provider
        value={{
          ...ONBOARDING_CONTEXT,
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
} satisfies Meta<typeof BankInformation>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const BankSaved: Story = {
  parameters: { onboardingContext: { hasBankSetup: true } },
};
export const SetupForm: Story = {
  play: async ({ canvasElement }) => {
    await userEvent.click(
      within(canvasElement).getByRole('button', {
        name: 'Add Bank Information',
      })
    );
  },
};
export const SetupError: Story = {
  parameters: {
    onboardingContext: {
      actions: {
        ...ONBOARDING_CONTEXT.actions,
        createAchSetupIntent: async () => {
          throw new Error(
            'Bank connection is temporarily unavailable. Please try again.'
          );
        },
      },
    },
  },
  play: SetupForm.play,
};
export const Preparing: Story = {
  parameters: {
    onboardingContext: {
      actions: {
        ...ONBOARDING_CONTEXT.actions,
        createAchSetupIntent: () => new Promise(() => {}),
      },
    },
  },
  play: SetupForm.play,
};
export const ContinueError: Story = {
  parameters: {
    onboardingContext: {
      hasBankSetup: true,
      completePaymentStep: async () => {
        throw new Error('Unable to save your progress. Please try again.');
      },
    },
  },
  play: async ({ canvasElement }) => {
    await userEvent.click(
      within(canvasElement).getByRole('button', { name: 'Continue' })
    );
  },
};
export const ReadOnly: Story = {
  parameters: { onboardingContext: { canEditFarm: false } },
};

export const ConfirmingStripeReturn: Story = {
  parameters: {
    onboardingContext: {
      returnedSetupIntentId: 'preview-returned-setup',
      actions: {
        ...ONBOARDING_CONTEXT.actions,
        recordAchSetupComplete: () => new Promise(() => {}),
      },
    },
  },
};

export const StripeReturnError: Story = {
  parameters: {
    onboardingContext: {
      returnedSetupIntentId: 'preview-returned-setup',
      actions: {
        ...ONBOARDING_CONTEXT.actions,
        recordAchSetupComplete: async () => {
          throw new Error(
            'We could not confirm your bank information. Please try again.'
          );
        },
      },
    },
  },
};

export const RestartAfterStripeReturn: Story = {
  parameters: StripeReturnError.parameters,
  play: async ({ canvasElement }) => {
    await userEvent.click(
      await within(canvasElement).findByRole('button', {
        name: 'Start bank setup again',
      })
    );
  },
};

export const SavingBankInformation: Story = {
  args: { renderSetupForm: () => <PendingBankSetup /> },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(
      canvas.getByRole('button', { name: 'Add Bank Information' })
    );
    await userEvent.click(
      await canvas.findByRole('button', { name: 'Save Bank Information' })
    );
  },
};
