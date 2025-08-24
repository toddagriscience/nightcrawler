import React from 'react';
import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import Quote from './quote';
import { ThemeProvider } from '@/context/ThemeContext';

const meta = {
  title: 'Landing/Quote',
  component: Quote,
  parameters: {
    layout: 'fullscreen',
  },
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <ThemeProvider>
        <Story />
      </ThemeProvider>
    ),
  ],
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

export const LightMode: Story = {
  args: {
    isDark: false,
  },
  decorators: [
    (Story) => (
      <div className="bg-[#CCC5B5] min-h-screen p-8">
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

export const WithCardBackground: Story = {
  args: {
    isDark: false,
  },
  decorators: [
    (Story) => (
      <div className="bg-[#F8F5EE] min-h-screen p-8">
        <div className="bg-[#CCC5B5] rounded-2xl p-8">
          <Story />
        </div>
      </div>
    ),
  ],
};

export const DarkModeWithCard: Story = {
  args: {
    isDark: true,
  },
  decorators: [
    (Story) => (
      <div className="bg-[#F8F5EE] min-h-screen p-8">
        <div className="bg-[#2A2727] text-[#FDFDFB] rounded-2xl p-8">
          <Story />
        </div>
      </div>
    ),
  ],
};
