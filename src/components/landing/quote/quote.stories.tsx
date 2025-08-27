//Copyright Todd LLC, All rights reserved.

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

// Story that demonstrates how the component looks in different languages
// Use the toolbar globe icon to switch between English and Spanish
export const MultiLanguage: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'This story shows how the Quote component adapts to different languages. Use the globe icon in the toolbar to switch between English (🇺🇸) and Spanish (🇪🇸).',
      },
    },
  },
  decorators: [
    (Story) => (
      <div className="bg-[#F8F5EE] min-h-screen p-8">
        <div
          style={{
            position: 'absolute',
            top: 10,
            left: 10,
            background: 'rgba(0,0,0,0.1)',
            padding: '4px 8px',
            borderRadius: '4px',
            fontSize: '12px',
            zIndex: 10,
          }}
        >
          💡 Use the globe (🌍) icon in the toolbar to switch languages
        </div>
        <Story />
      </div>
    ),
  ],
};
