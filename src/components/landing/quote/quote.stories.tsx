import React from 'react';
import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import Quote from './quote';
import {
  storybookControls,
  storybookArgs,
} from '../../../../.storybook/utils/storybookControls';

const meta = {
  title: 'Landing/Quote',
  component: Quote,
  parameters: {
    layout: 'fullscreen',
  },
  argTypes: {
    ...storybookControls,
    isDark: {
      control: 'boolean',
      description: 'Use dark theme colors',
    },
  },
  args: {
    ...storybookArgs,
    isDark: false,
  },
  tags: ['autodocs'],
} satisfies Meta<typeof Quote>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  decorators: [
    (Story) => (
      <div className="bg-[#F8F5EE] min-h-screen p-8">
        <Story />
      </div>
    ),
  ],
};

export const DarkMode: Story = {
  args: {
    isDark: true,
  },
  decorators: [
    (Story) => (
      <div className="bg-[#2A2727] text-[#FDFDFB] min-h-screen p-8">
        <Story />
      </div>
    ),
  ],
};
