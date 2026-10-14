// Copyright © Todd Agriscience, Inc. All rights reserved.

import type { Meta, StoryObj } from '@storybook/react-vite';
import { userEvent, within } from 'storybook/test';
import { ContactForm } from './contact-form';
import type { ContactResult } from '../types';

const meta = {
  title: 'Authenticated/Contact/Form',
  component: ContactForm,
  tags: ['autodocs'],
  args: {
    senderName: 'Alex Client',
    senderEmail: 'alex@example.test',
    farmName: 'Green Acres',
    submitAction: async (): Promise<ContactResult> => ({
      success: true,
      id: 42,
    }),
  },
  decorators: [
    (Story) => (
      <div className="mx-auto max-w-2xl px-4 py-8">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof ContactForm>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Empty: Story = {};
export const Sent: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.type(
      canvas.getByRole('textbox', { name: 'Subject' }),
      'Soil results'
    );
    await userEvent.type(
      canvas.getByRole('textbox', { name: 'Message' }),
      'Please review the soil results for our farm.'
    );
    await userEvent.click(canvas.getByRole('button', { name: 'Send message' }));
  },
};
export const DeliveryFailure: Story = {
  args: {
    submitAction: async () => ({
      success: false,
      message: 'Your message could not be sent. Please try again.',
    }),
  },
  play: Sent.play,
};
