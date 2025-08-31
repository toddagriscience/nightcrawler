// Copyright Todd LLC, All rights reserved.

import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import PageHero from './page-hero';
import {
  storybookControls,
  storybookArgs,
} from '../../../../.storybook/utils/storybookControls';

const meta = {
  title: 'Common/PageHero',
  component: PageHero,
  parameters: {
    layout: 'fullscreen',
  },
  argTypes: {
    ...storybookControls,
    title: {
      control: { type: 'text' },
      description: 'The main title to display',
    },
    subtitle: {
      control: { type: 'text' },
      description: 'Optional subtitle text',
    },
    showArrow: {
      control: { type: 'boolean' },
      description: 'Whether to show the arrow indicator',
    },
    className: {
      control: { type: 'text' },
      description: 'Additional CSS classes',
    },
  },
  args: {
    ...storybookArgs,
    title: 'Who We Are',
    subtitle:
      'Todd is a first-generation generative agriculture firm that aims to partner with high-growth, branded, regenerative farms.',
    showArrow: true,
  },
  tags: ['autodocs'],
} satisfies Meta<typeof PageHero>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const WithoutSubtitle: Story = {
  args: {
    title: 'About',
    subtitle: undefined,
  },
};

export const WithoutArrow: Story = {
  args: {
    title: 'Services',
    subtitle:
      'We provide comprehensive agricultural solutions designed to enhance productivity while maintaining environmental stewardship and sustainable farming practices.',
    showArrow: false,
  },
};

export const LongTitle: Story = {
  args: {
    title: 'Sustainable Agriculture Research',
    subtitle:
      'Todd Agriscience is committed to developing cutting-edge solutions that benefit both farmers and the environment through innovative research and development partnerships.',
  },
};

export const WithBackground: Story = {
  decorators: [
    (Story) => (
      <div className="bg-[#F8F5EE] min-h-screen">
        <Story />
      </div>
    ),
  ],
};

export const CustomStyling: Story = {
  args: {
    title: 'Custom Hero',
    subtitle: 'This hero has custom styling applied',
    className: 'bg-gradient-to-b from-blue-50 to-green-50',
  },
};
