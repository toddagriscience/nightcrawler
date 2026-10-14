// Copyright © Todd Agriscience, Inc. All rights reserved.

import type { Meta, StoryObj } from '@storybook/react-vite';

import { IrisButton } from './iris-button';

const meta = {
  title: 'Common/IrisButton',
  component: IrisButton,
  parameters: {
    layout: 'centered',
  },
  args: {
    children: 'Button',
    variant: 'primary',
  },
  argTypes: {
    variant: {
      control: { type: 'select' },
      options: ['primary', 'outline', 'destructive'],
    },
  },
} satisfies Meta<typeof IrisButton>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {};

export const Outline: Story = {
  args: {
    variant: 'outline',
  },
};

export const Destructive: Story = {
  args: {
    variant: 'destructive',
  },
};

export const Both: Story = {
  render: () => (
    <div className="flex items-center gap-3 bg-white p-6">
      <IrisButton variant="outline">Button</IrisButton>
      <IrisButton>Button</IrisButton>
      <IrisButton variant="destructive">Button</IrisButton>
    </div>
  ),
};
