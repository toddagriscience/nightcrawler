import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import ScrollShrinkWrapper from './scroll-shrink-wrapper';

const meta = {
  title: 'Landing/ScrollShrinkWrapper',
  component: ScrollShrinkWrapper,
  parameters: {
    layout: 'fullscreen',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof ScrollShrinkWrapper>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    children: (
      <div className="bg-blue-200 p-8 text-center">
        <h2 className="text-2xl font-bold">Scroll Shrink Content</h2>
        <p>This content will shrink from 100vw to 98vw as you scroll</p>
      </div>
    ),
  },
};

export const WithTallContent: Story = {
  args: {
    children: (
      <div className="bg-green-200 p-8">
        <h2 className="text-2xl font-bold mb-4">Tall Content</h2>
        <div style={{ height: '200vh' }} className="bg-green-300 p-4">
          <p>Scroll down to see the shrinking effect</p>
          <p className="mt-4">
            This content is tall enough to trigger scroll animations
          </p>
        </div>
      </div>
    ),
  },
};
