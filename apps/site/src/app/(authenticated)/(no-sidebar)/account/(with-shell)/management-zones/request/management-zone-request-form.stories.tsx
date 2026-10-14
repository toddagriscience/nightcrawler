// Copyright © Todd Agriscience, Inc. All rights reserved.

import type { Meta, StoryObj } from '@storybook/react-vite';
import { userEvent, within } from 'storybook/test';
import ManagementZoneRequestForm from './management-zone-request-form';

const meta = {
  title: 'Account/Management zone request',
  component: ManagementZoneRequestForm,
  args: { submitRequest: async () => ({ success: true as const, zoneId: 7 }) },
  decorators: [
    (Story) => (
      <div className="mx-auto max-w-lg p-6">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof ManagementZoneRequestForm>;
export default meta;
type Story = StoryObj<typeof ManagementZoneRequestForm>;
export const Empty: Story = {};
export const Filled: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.type(canvas.getByLabelText('Zone name'), 'North field');
    await userEvent.type(canvas.getByLabelText('Location'), 'West of the barn');
    await userEvent.type(canvas.getByLabelText('Acreage (optional)'), '12.5');
  },
};
export const Saving: Story = {
  args: { submitRequest: () => new Promise(() => {}) },
  play: async (context) => {
    await Filled.play?.(context);
    await userEvent.click(
      within(context.canvasElement).getByRole('button', {
        name: 'Request management zone',
      })
    );
  },
};
export const ServerError: Story = {
  args: {
    submitRequest: async () => ({
      success: false as const,
      error: 'Unable to submit your request. Please try again.',
    }),
  },
  play: Saving.play,
};
