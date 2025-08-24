import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import Header from './header';

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
    alwaysGlassy: {
      control: 'boolean',
      description: 'Always show the glassmorphism background effect',
    },
    isDark: {
      control: 'boolean',
      description: 'Use dark theme colors',
    },
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

export const WithMenuOpen: Story = {
  args: {
    alwaysGlassy: true,
    isDark: false,
  },
  parameters: {
    docs: {
      description: {
        story: 'Header showing the open navigation menu state.',
      },
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = canvasElement;
    const menuButton = canvas.querySelector(
      '[aria-label="Open menu"]'
    ) as HTMLElement;
    if (menuButton) {
      menuButton.click();
    }
  },
};

export const OnLightBackground: Story = {
  args: {
    alwaysGlassy: true,
    isDark: false,
  },
  parameters: {
    docs: {
      description: {
        story: 'Header on a light background showing proper contrast.',
      },
    },
    backgrounds: {
      default: 'light',
    },
  },
  decorators: [
    (Story) => (
      <div style={{ background: '#f8f5ee', minHeight: '100vh' }}>
        <Story />
      </div>
    ),
  ],
};
