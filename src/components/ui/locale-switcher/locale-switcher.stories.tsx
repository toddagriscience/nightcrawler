import React from 'react';
import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import LocaleSwitcher from './locale-switcher';
import {
  storybookControls,
  storybookArgs,
} from '../../../../.storybook/utils/storybookControls';

const meta = {
  title: 'UI/LocaleSwitcher',
  component: LocaleSwitcher,
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    ...storybookControls,
    className: {
      control: 'text',
      description: 'Additional CSS classes',
    },
  },
  args: {
    ...storybookArgs,
    className: '',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof LocaleSwitcher>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    className: '',
  },
  decorators: [
    (Story) => (
      <div
        className="fixed inset-0 p-8 flex items-center justify-center"
        style={{
          backgroundColor: '#f8f5ee',
          color: '#2A2727',
        }}
      >
        <Story />
      </div>
    ),
  ],
};

export const Dark: Story = {
  args: {
    ...storybookArgs,
    // @ts-expect-error - isDark is handled by StorybookProvider decorator
    isDark: true,
    className: '',
  },
  decorators: [
    (Story) => (
      <div
        className="fixed inset-0 p-8 flex items-center justify-center"
        style={{
          backgroundColor: '#2A2727',
          color: '#FDFDFB',
        }}
      >
        <Story />
      </div>
    ),
  ],
};
