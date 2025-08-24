import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import Footer from './footer';

const meta: Meta<typeof Footer> = {
  title: 'UI/Footer',
  component: Footer,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          'The main website footer containing navigation links, social media links, legal links, and company information.',
      },
    },
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof Footer>;

export const Default: Story = {
  parameters: {
    docs: {
      description: {
        story: 'The default footer as it appears on all pages of the website.',
      },
    },
  },
};

export const WithScrolledView: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'Footer view showing how it appears when users scroll to the bottom of a page.',
      },
    },
    viewport: {
      defaultViewport: 'desktop',
    },
  },
  decorators: [
    (Story) => (
      <div
        style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}
      >
        <div style={{ flex: 1, background: '#fff', padding: '2rem' }}>
          <h1>Page Content</h1>
          <p>This represents the main page content above the footer.</p>
        </div>
        <Story />
      </div>
    ),
  ],
};

export const Mobile: Story = {
  parameters: {
    viewport: {
      defaultViewport: 'mobile1',
    },
    docs: {
      description: {
        story: 'Footer optimized for mobile devices with responsive layout.',
      },
    },
  },
};

export const Tablet: Story = {
  parameters: {
    viewport: {
      defaultViewport: 'tablet',
    },
    docs: {
      description: {
        story: 'Footer layout on tablet devices showing the grid adaptation.',
      },
    },
  },
};
