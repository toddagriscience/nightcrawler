// Copyright © Todd Agriscience, Inc. All rights reserved.

import type { Meta, StoryObj } from '@storybook/react-vite';
import { userEvent, within } from 'storybook/test';
import InvitedUser from '@/app/(onboarding)/apply/components/colleagues/invited-user';
import { ApplicationContext } from '@/app/(onboarding)/apply/components/onboarding-context';
import { ONBOARDING_CONTEXT } from '@/app/(onboarding)/apply/components/onboarding-fixtures';
import type { OnboardingContextValue } from '@/app/(onboarding)/apply/types';

const meta = {
  title: 'Onboarding/Invited User',
  component: InvitedUser,
  tags: ['autodocs'],
  args: {
    invitedUser: {
      ...ONBOARDING_CONTEXT.currentUser,
      id: 2,
      firstName: 'Sam',
      lastName: 'Chen',
      email: 'sam@example.com',
      role: 'Viewer',
    },
    isVerified: false,
    canEditFarm: true,
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
} satisfies Meta<typeof InvitedUser>;
export default meta;
type Story = StoryObj<typeof meta>;

export const PendingInvitation: Story = {};
export const Verified: Story = { args: { isVerified: true } };
export const CurrentUser: Story = {
  args: { isVerified: true, isCurrentUser: true },
};
export const ReadOnly: Story = { args: { canEditFarm: false } };
export const ResendError: Story = {
  parameters: {
    onboardingContext: {
      actions: {
        ...ONBOARDING_CONTEXT.actions,
        resendVerificationEmail: async () => {
          throw new Error('Unable to send the invitation. Please try again.');
        },
      },
    },
  },
  play: async ({ canvasElement }) => {
    await userEvent.click(
      within(canvasElement).getByRole('button', {
        name: 'Resend invitation to Sam Chen',
      })
    );
  },
};
export const RemoveError: Story = {
  parameters: {
    onboardingContext: {
      actions: {
        ...ONBOARDING_CONTEXT.actions,
        uninviteUser: async () => {
          throw new Error('Unable to remove the invitation. Please try again.');
        },
      },
    },
  },
  play: async ({ canvasElement }) => {
    await userEvent.click(
      within(canvasElement).getByRole('button', { name: 'Remove Sam Chen' })
    );
  },
};
