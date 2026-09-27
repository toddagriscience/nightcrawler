// Copyright © Todd Agriscience, Inc. All rights reserved.

import type { Meta, StoryObj } from '@storybook/react-vite';
import { userEvent, within } from 'storybook/test';
import Colleagues from '@/app/(onboarding)/apply/components/colleagues';
import { ApplicationContext } from '@/app/(onboarding)/apply/components/onboarding-context';
import { ONBOARDING_CONTEXT } from '@/app/(onboarding)/apply/components/onboarding-fixtures';
import type { OnboardingContextValue } from '@/app/(onboarding)/apply/types';

const meta = {
  title: 'Onboarding/Add People',
  component: Colleagues,
  tags: ['autodocs'],
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
} satisfies Meta<typeof Colleagues>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const WithTeamMember: Story = {
  parameters: {
    onboardingContext: {
      allUsers: [
        ONBOARDING_CONTEXT.currentUser,
        {
          ...ONBOARDING_CONTEXT.currentUser,
          id: 2,
          firstName: 'Sam',
          lastName: 'Chen',
          email: 'sam@example.com',
          role: 'Viewer',
        },
      ],
      invitedUserVerificationStatus: [
        { email: ONBOARDING_CONTEXT.currentUser.email, verified: true },
      ],
    },
  },
};
export const ContinueError: Story = {
  parameters: {
    onboardingContext: {
      completeTeamStep: async () => {
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
export const Continuing: Story = {
  parameters: {
    onboardingContext: { completeTeamStep: () => new Promise(() => {}) },
  },
  play: ContinueError.play,
};
export const ReadOnly: Story = {
  parameters: { onboardingContext: { canEditFarm: false } },
};
