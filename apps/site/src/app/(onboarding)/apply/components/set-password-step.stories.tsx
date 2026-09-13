// Copyright © Todd Agriscience, Inc. All rights reserved.

import type { Meta, StoryObj } from '@storybook/react-vite';
import { userEvent, within } from 'storybook/test';
import SetPasswordStep from '@/app/(onboarding)/apply/components/set-password-step';

const meta = {
  title: 'Onboarding/Set password',
  component: SetPasswordStep,
  args: {
    applicant: {
      applicationId: 42,
      token: 'preview-token',
      email: 'alex@example.com',
    },
    action: async () => ({}),
    onComplete: () => {},
  },
  decorators: [
    (Story) => (
      <div className="mx-auto w-[550px] py-8">
        <Story />
      </div>
    ),
  ],
  parameters: { nextjs: { navigation: { pathname: '/apply' } } },
} satisfies Meta<typeof SetPasswordStep>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Empty: Story = {};
export const Valid: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.type(
      canvas.getByLabelText('Create a Password'),
      'Example1!'
    );
    await userEvent.type(
      canvas.getByLabelText('Confirm Password'),
      'Example1!'
    );
  },
};
export const Invalid: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.type(canvas.getByLabelText('Create a Password'), 'short');
    await userEvent.type(
      canvas.getByLabelText('Confirm Password'),
      'different'
    );
  },
};
export const Saving: Story = {
  args: { action: () => new Promise(() => {}) },
  play: async (context) => {
    await Valid.play?.(context);
    await userEvent.click(
      within(context.canvasElement).getByRole('button', { name: 'Continue' })
    );
  },
};
export const ServerError: Story = {
  args: {
    action: async () => {
      throw new Error('Unable to save your password. Please try again.');
    },
  },
  play: Saving.play,
};
export const SavedPasswordRecovery: Story = {
  args: { applicant: { ...meta.args.applicant, passwordSet: true } },
};
