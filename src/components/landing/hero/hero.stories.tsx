import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import Hero from './hero';
import {
  storybookControls,
  storybookArgs,
} from '../../../../.storybook/utils/storybookControls';

const meta = {
  title: 'Landing/Hero',
  component: Hero,
  parameters: {
    layout: 'fullscreen',
  },
  argTypes: storybookControls,
  args: storybookArgs,
  tags: ['autodocs'],
} satisfies Meta<typeof Hero>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const WithBackground: Story = {
  decorators: [
    (Story) => (
      <div className="bg-[#F8F5EE] min-h-screen">
        <Story />
      </div>
    ),
  ],
};
