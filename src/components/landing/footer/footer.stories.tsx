// Copyright Todd LLC, All rights reserved.

import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import Footer from './footer';
import {
  storybookControls,
  storybookArgs,
} from '../../../../.storybook/utils/storybookControls';

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
  argTypes: storybookControls,
  args: storybookArgs,
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
          <div style={{ height: '70vh' }}>
            <p>
              This represents the main page content above the footer. Scroll to
              the bottom to see the footer.
            </p>
          </div>
        </div>
        <Story />
      </div>
    ),
  ],
};

// Story that demonstrates how the footer looks in different languages
// Use the toolbar globe icon to switch between English and Spanish
export const MultiLanguage: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'This story shows how the Footer component adapts to different languages. Use the globe icon in the toolbar to switch between English (🇺🇸) and Spanish (🇪🇸). Notice how the section headings, links, and call-to-action text change.',
      },
    },
  },
  decorators: [
    (Story) => (
      <div
        style={{ background: '#f8f5ee', minHeight: '100vh', padding: '2rem' }}
      >
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
