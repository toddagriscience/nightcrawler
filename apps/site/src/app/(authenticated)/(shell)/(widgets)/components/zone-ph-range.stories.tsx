// Copyright © Todd Agriscience, Inc. All rights reserved.

import type { Meta, StoryObj } from '@storybook/react-vite';
import { toPhRange } from './to-ph-range';
import { ZonePhRange } from './zone-ph-range';

const HARDEN_TARGET = { phLow: 7.3, phHigh: 7.8 };

const meta = {
  title: 'Authenticated/Zone/ZonePhRange',
  component: ZonePhRange,
  parameters: {
    layout: 'padded',
  },
  decorators: [
    (Story) => (
      <div className="mx-auto w-[32rem] px-6">
        <Story />
      </div>
    ),
  ],
  tags: ['autodocs'],
} satisfies Meta<typeof ZonePhRange>;

export default meta;
type Story = StoryObj<typeof meta>;

export const HardenWithinTarget: Story = {
  args: toPhRange({ value: 7.4, ...HARDEN_TARGET }),
};

export const BelowTarget: Story = {
  args: toPhRange({ value: 6.8, ...HARDEN_TARGET }),
};

export const AboveTarget: Story = {
  args: toPhRange({ value: 7.9, ...HARDEN_TARGET }),
};

export const Unconfigured: Story = {
  args: toPhRange({ value: 7.4, phLow: null, phHigh: null }),
};

export const ClampedBelowDomain: Story = {
  args: toPhRange({ value: 4.1, ...HARDEN_TARGET }),
};

export const ClampedAboveDomain: Story = {
  args: toPhRange({ value: 9.0, ...HARDEN_TARGET }),
};
