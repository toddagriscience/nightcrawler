// Copyright Todd LLC, All rights reserved.

import React from 'react';
import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import NewsCard from './news-card';

const meta = {
  title: 'Common/NewsCard',
  component: NewsCard,
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    image: {
      control: 'text',
      description: 'Image URL for the news card',
    },
    source: {
      control: 'text',
      description: 'News source name',
    },
    date: {
      control: 'text',
      description: 'Publication date',
    },
    headline: {
      control: 'text',
      description: 'News headline',
    },
    isDark: {
      control: 'boolean',
      description: 'Use dark theme colors',
    },
  },
  args: {
    image: '/images/placeholder.jpg',
    source: 'Todd Journal',
    date: 'Apr 15, 2025',
    headline: 'Revolutionary Advances in Sustainable Agriculture Technology',
    isDark: false,
  },
  tags: ['autodocs'],
} satisfies Meta<typeof NewsCard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  decorators: [
    (Story: React.ComponentType, context) => {
      const isDark = context.args.isDark;
      return (
        <div
          style={{
            backgroundColor: isDark ? '#2A2727' : '#F8F5EE',
            minHeight: '100vh',
            padding: '2rem',
            maxWidth: '600px',
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
  },
  decorators: [
    (Story: React.ComponentType) => (
      <div
        style={{
          backgroundColor: '#2A2727',
          minHeight: '100vh',
          padding: '2rem',
          maxWidth: '600px',
        }}
      >
        <Story />
      </div>
    ),
  ],
};

export const LongHeadline: Story = {
  args: {
    headline:
      'Todd Agriscience Announces Groundbreaking Partnership with Leading Agricultural Research Institute to Develop Next-Generation Sustainable Farming Solutions',
  },
  decorators: [
    (Story: React.ComponentType, context) => {
      const isDark = context.args.isDark;
      return (
        <div
          style={{
            backgroundColor: isDark ? '#2A2727' : '#F8F5EE',
            minHeight: '100vh',
            padding: '2rem',
            maxWidth: '600px',
          }}
        >
          <Story />
        </div>
      );
    },
  ],
};
