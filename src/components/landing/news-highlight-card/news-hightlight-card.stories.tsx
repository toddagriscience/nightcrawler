import React from 'react';
import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import NewsHighlightCard from './news-hightlight-card';
import { ThemeProvider } from '@/context/ThemeContext';
import { LocaleProvider } from '@/context/LocaleContext';

const meta = {
  title: 'Landing/NewsHighlightCard',
  component: NewsHighlightCard,
  parameters: {
    layout: 'fullscreen',
  },
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <ThemeProvider>
        <LocaleProvider>
          <Story />
        </LocaleProvider>
      </ThemeProvider>
    ),
  ],
} satisfies Meta<typeof NewsHighlightCard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  decorators: [
    (Story) => (
      <ThemeProvider>
        <div
          style={{
            backgroundColor: '#F8F5EE',
            minHeight: '100vh',
            padding: '2rem',
          }}
        >
          <LocaleProvider>
            <Story />
          </LocaleProvider>
        </div>
      </ThemeProvider>
    ),
  ],
};

export const DarkMode: Story = {
  args: {
    isDark: true,
  },
  decorators: [
    (Story) => (
      <ThemeProvider>
        <div
          style={{
            backgroundColor: '#2A2727',
            color: '#FDFDFB',
            minHeight: '100vh',
            padding: '2rem',
          }}
        >
          <LocaleProvider>
            <Story />
          </LocaleProvider>
        </div>
      </ThemeProvider>
    ),
  ],
};
