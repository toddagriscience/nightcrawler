import React from 'react';
import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import LocaleSwitcher from './locale-switcher';
import { LocaleProvider } from '@/context/LocaleContext';
import { ThemeProvider } from '@/context/ThemeContext';

const meta = {
  title: 'UI/LocaleSwitcher',
  component: LocaleSwitcher,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <ThemeProvider>
        <LocaleProvider>
          <div className="p-8 bg-gray-50">
            <Story />
          </div>
        </LocaleProvider>
      </ThemeProvider>
    ),
  ],
} satisfies Meta<typeof LocaleSwitcher>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const LightMode: Story = {
  decorators: [
    (Story) => (
      <ThemeProvider>
        <LocaleProvider>
          <div className="p-8 bg-[#F8F5EE]">
            <Story />
          </div>
        </LocaleProvider>
      </ThemeProvider>
    ),
  ],
};

export const DarkMode: Story = {
  decorators: [
    (Story) => (
      <ThemeProvider>
        <LocaleProvider>
          <div className="p-8 bg-[#2A2727]" data-theme="dark">
            <Story />
          </div>
        </LocaleProvider>
      </ThemeProvider>
    ),
  ],
};

export const InHeader: Story = {
  decorators: [
    (Story) => (
      <ThemeProvider>
        <LocaleProvider>
          <div className="w-full">
            <header className="bg-white/10 backdrop-blur-md rounded-2xl p-4">
              <div className="flex justify-between items-center">
                <div className="text-xl font-bold">Logo</div>
                <Story />
              </div>
            </header>
          </div>
        </LocaleProvider>
      </ThemeProvider>
    ),
  ],
};
