// Copyright © Todd Agriscience, Inc. All rights reserved.

import type { Meta, StoryObj } from '@storybook/react-vite';
import { VarietyPublicList } from './variety-public-list';

const meta = {
  title: 'Marketing/Varieties/PublicList',
  component: VarietyPublicList,
  tags: ['autodocs'],
  parameters: { layout: 'fullscreen' },
  decorators: [
    (Story) => (
      <div className="mx-auto max-w-4xl px-4 py-10">
        <Story />
      </div>
    ),
  ],
  args: {
    items: [
      {
        id: 1260,
        name: 'CANARY BIRD',
        description: 'Rich canary yellow pods.',
        cropName: 'BEAN',
        status: 'available',
      },
      {
        id: 1261,
        name: 'MAYFLOWER',
        description: 'Climbing plants with speckled seeds.',
        cropName: 'BEAN',
        status: 'back_order',
      },
      {
        id: 1262,
        name: 'BEURRÉ DE ROCQUENCOURT',
        description: null,
        cropName: 'BEAN',
        status: 'reference',
      },
      {
        id: 1263,
        name: 'LONG PURPLE',
        description: 'Elongated purple fruit.',
        cropName: 'EGGPLANT',
        status: 'available',
      },
    ],
  },
} satisfies Meta<typeof VarietyPublicList>;

export default meta;
type Story = StoryObj<typeof meta>;

export const AllStatuses: Story = {};

export const Spanish: Story = {
  globals: { locale: 'es' },
};
