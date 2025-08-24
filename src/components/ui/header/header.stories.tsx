import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import Header from './header';
import {
  storybookControls,
  storybookArgs,
} from '../../../../.storybook/utils/storybookControls';

const meta: Meta<typeof Header> = {
  title: 'UI/Header',
  component: Header,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          'The main website header/navigation bar with responsive menu and glassmorphism effects.',
      },
    },
  },
  argTypes: {
    ...storybookControls,
    alwaysGlassy: {
      control: 'boolean',
      description: 'Always show the glassmorphism background effect',
    },
    isDark: {
      control: 'boolean',
      description: 'Use dark theme colors',
    },
  },
  args: {
    ...storybookArgs,
    alwaysGlassy: false,
    isDark: false,
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof Header>;

export const Default: Story = {
  args: {
    alwaysGlassy: false,
    isDark: false,
  },
  parameters: {
    docs: {
      description: {
        story:
          'The default header state. The glassmorphism effect appears on scroll.',
      },
    },
  },
};

export const AlwaysGlassy: Story = {
  args: {
    alwaysGlassy: true,
    isDark: false,
  },
  parameters: {
    docs: {
      description: {
        story:
          'Header with always-visible glassmorphism effect and TODD wordmark.',
      },
    },
  },
};

export const DarkTheme: Story = {
  args: {
    alwaysGlassy: true,
    isDark: true,
  },
  parameters: {
    docs: {
      description: {
        story: 'Dark themed header for use on dark backgrounds.',
      },
    },
    backgrounds: {
      default: 'dark',
    },
  },
  decorators: [
    (Story) => (
      <div style={{ background: '#2A2727', minHeight: '100vh' }}>
        <Story />
      </div>
    ),
  ],
};
