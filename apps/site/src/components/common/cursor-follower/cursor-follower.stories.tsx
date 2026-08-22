// Copyright © Todd Agriscience, Inc. All rights reserved.

import type { Meta, StoryObj } from '@storybook/react-vite';
import { CursorFollower } from './cursor-follower';

const DEMO_ROWS = [
  'Announcing the Todd Founder Program',
  'Todd joins the Global Affairs Council',
  'A new season of field trials begins',
];

const meta = {
  title: 'Common/CursorFollower',
  component: CursorFollower,
  parameters: {
    layout: 'fullscreen',
  },
  tags: ['autodocs'],
  argTypes: {
    className: {
      control: { type: 'text' },
      description: 'Extra classes merged onto the bubble',
    },
  },
} satisfies Meta<typeof CursorFollower>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * News-style rows tagged with `data-cursor-label="View"`. Move a mouse over a
 * row to see the follower expand; it is absent on touch devices by design.
 */
export const NewsRows: Story = {
  render: (args) => (
    <div className="bg-white p-10 text-black">
      <p className="mb-6 text-[14px] text-[#666666]">
        Hover the rows with a mouse or trackpad.
      </p>
      <ul>
        {DEMO_ROWS.map((title) => (
          <li key={title} className="border-b border-[rgba(226,226,226,0.5)]">
            <a
              href="#"
              data-cursor-label="View"
              className="block py-7 transition-opacity hover:opacity-70"
            >
              <h2 className="text-[18px] font-normal leading-[26px]">
                {title}
              </h2>
            </a>
          </li>
        ))}
      </ul>
      <CursorFollower {...args} />
    </div>
  ),
};

/** Larger, brand-green bubble via `className`. */
export const CustomStyle: Story = {
  ...NewsRows,
  args: {
    className: 'size-24 bg-[#2f5d3a] text-[16px]',
  },
};
