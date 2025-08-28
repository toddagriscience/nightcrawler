// Copyright Todd LLC, All rights reserved.

import React from 'react';
import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import Carousel from './carousel';
import NewsCard from '../news-card/news-card';
import { theme } from '@/lib/theme';

const meta = {
  title: 'Common/Carousel',
  component: Carousel,
  parameters: {
    layout: 'fullscreen',
  },
  argTypes: {
    isDark: {
      control: 'boolean',
      description: 'Use dark theme colors',
    },
    loop: {
      control: 'boolean',
      description: 'Enable loop mode',
    },
  },
  args: {
    isDark: false,
    loop: true,
    showDots: true,
  },
  tags: ['autodocs'],
} satisfies Meta<typeof Carousel>;

export default meta;
type Story = StoryObj<typeof meta>;

const sampleNewsCards = (
  <>
    <NewsCard
      image="/images/placeholder.jpg"
      source="Journal"
      date="Apr 15, 2025"
      headline="Todd Announces Partnership with Agricultural Innovation Lab"
    />
    <NewsCard
      image="/images/placeholder.jpg"
      source="PR Newswire"
      date="Mar 30, 2025"
      headline="Todd Introduces Revolutionary Regenerative Farming Techniques"
    />
    <NewsCard
      image="/images/placeholder.jpg"
      source="AgTech Weekly"
      date="Feb 12, 2025"
      headline="Sustainable Agriculture Solutions Show Promising Results"
    />
    <NewsCard
      image="/images/placeholder.jpg"
      source="Farm Journal"
      date="Jan 28, 2025"
      headline="Next Generation of Farming Technology Unveiled"
    />
  </>
);

export const Default: Story = {
  args: {
    children: sampleNewsCards,
  },
  decorators: [
    (Story: React.ComponentType, context) => {
      const isDark = context.args.isDark;
      return (
        <div
          style={{
            backgroundColor: isDark
              ? theme.colors.primary
              : theme.colors.background,
            minHeight: '100vh',
            padding: '2rem',
          }}
        >
          <Story />
        </div>
      );
    },
  ],
};

export const DarkMode: Story = {
  args: {
    isDark: true,
    children: sampleNewsCards,
  },
  decorators: [
    (Story: React.ComponentType) => (
      <div
        style={{
          backgroundColor: '#2A2727',
          minHeight: '100vh',
          padding: '2rem',
        }}
      >
        <Story />
      </div>
    ),
  ],
};
