// Copyright Todd LLC, All rights reserved.

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
  args: {
    isDark: false,
  },
  render: (args) => (
    <div className="p-8">
      <Quote {...args} />
    </div>
  ),
};

export const DarkMode: Story = {
  args: {
    isDark: true,
  },
  render: (args) => (
    <div className="p-8">
      <Quote {...args} />
    </div>
  ),
};

// Story that demonstrates how the component looks in different languages
// Use the toolbar globe icon to switch between English and Spanish
export const MultiLanguage: Story = {
  args: {
    isDark: false,
  },
  parameters: {
    docs: {
      description: {
        story:
          'This story shows how the Quote component adapts to different languages. Use the globe icon in the toolbar to switch between English (🇺🇸) and Spanish (🇪🇸).',
      },
    },
  },
  render: (args) => (
    <div className="p-8">
      <div
        style={{
          position: 'absolute',
          top: 10,
          left: 10,
          background: 'hsl(var(--muted))',
          color: 'hsl(var(--muted-foreground))',
          padding: '4px 8px',
          borderRadius: '4px',
          fontSize: '12px',
          zIndex: 10,
        }}
      >
        💡 Use the globe (🌍) icon in the toolbar to switch languages
      </div>
      <Quote {...args} />
    </div>
  ),
};
