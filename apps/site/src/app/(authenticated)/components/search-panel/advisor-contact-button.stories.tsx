// Copyright © Todd Agriscience, Inc. All rights reserved.

import type { Meta, StoryObj } from '@storybook/react-vite';
import { AdvisorContactButton } from './advisor-contact-button';
import type { InferenceContactResult } from '@/app/(authenticated)/(shell)/(misc)/support/contact/types';

const meta = {
  title: 'Platform/Search/AdvisorContactButton',
  component: AdvisorContactButton,
  args: {
    questions: ['Why are my tomatoes yellow?', 'What should I change?'],
    managementZoneId: 12,
    prepareAction: async (): Promise<InferenceContactResult> => ({
      success: false,
      message: 'This preview keeps your search here. No request was sent.',
    }),
  },
} satisfies Meta<typeof AdvisorContactButton>;
export default meta;
type Story = StoryObj<typeof meta>;
export const UnansweredSearch: Story = {};
export const TransferFailure: Story = {
  args: {
    prepareAction: async () => ({
      success: false,
      message: 'Your questions could not be transferred. Please try again.',
    }),
  },
};
