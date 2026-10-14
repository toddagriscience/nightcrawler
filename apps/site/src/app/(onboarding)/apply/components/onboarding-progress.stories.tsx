// Copyright © Todd Agriscience, Inc. All rights reserved.

import type { Meta, StoryObj } from '@storybook/react-vite';
import OnboardingProgress from '@/app/(onboarding)/apply/components/onboarding-progress';

const meta = {
  title: 'Onboarding/Progress',
  component: OnboardingProgress,
  decorators: [
    (Story) => (
      <div className="w-[550px] p-4">
        <Story />
      </div>
    ),
  ],
  args: { step: 'password' },
  parameters: { nextjs: { navigation: { pathname: '/apply' } } },
} satisfies Meta<typeof OnboardingProgress>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Password: Story = {};
export const Team: Story = { args: { step: 'team' } };
export const Payment: Story = { args: { step: 'payment' } };
export const Terms: Story = { args: { step: 'terms' } };
