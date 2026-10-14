// Copyright © Todd Agriscience, Inc. All rights reserved.

import type { Meta, StoryObj } from '@storybook/react-vite';
import { ZoneInsight } from './zone-insight';

const meta = {
  title: 'Authenticated/Zone/ZoneInsight',
  component: ZoneInsight,
  parameters: {
    layout: 'padded',
  },
  decorators: [
    (Story) => (
      <div className="divide-foreground/10 mx-auto max-w-4xl divide-y px-6">
        <Story />
      </div>
    ),
  ],
  tags: ['autodocs'],
} satisfies Meta<typeof ZoneInsight>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Both: Story = {
  args: {
    summary:
      'Highest pH in the set, with lower zinc and manganese than most zones. Calcium, magnesium, and potassium are moderate.',
    action:
      'Focus on nutrient availability at the higher pH level, especially zinc and manganese. Compare this zone with neighboring fields before making a field-specific adjustment.',
  },
};

export const SummaryOnly: Story = {
  args: {
    summary:
      'Highest pH in the set, with lower zinc and manganese than most zones. Calcium, magnesium, and potassium are moderate.',
    action: null,
  },
};

export const ActionOnly: Story = {
  args: {
    summary: null,
    action:
      'Focus on nutrient availability at the higher pH level, especially zinc and manganese. Compare this zone with neighboring fields before making a field-specific adjustment.',
  },
};
