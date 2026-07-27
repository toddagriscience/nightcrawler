// Copyright © Todd Agriscience, Inc. All rights reserved.

import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import PillarsSection from './pillars-section';

const placeholderCopy: Record<string, string> = {
  'pillars.title': 'Pillars',
  'pillars.subtitle':
    'Placeholder subtitle describing the five pillars that guide our work with farms.',
  'pillars.items.0.heading': 'Soil',
  'pillars.items.0.description':
    'Placeholder description for our soil practices.',
  'pillars.items.1.heading': 'Growing',
  'pillars.items.1.description':
    'Placeholder description for our growing practices.',
  'pillars.items.2.heading': 'Water',
  'pillars.items.2.description':
    'Placeholder description for our water practices.',
  'pillars.items.3.heading': 'Pests',
  'pillars.items.3.description':
    'Placeholder description for our pest management practices.',
  'pillars.items.4.heading': 'Harvest',
  'pillars.items.4.description':
    'Placeholder description for our harvest practices.',
};

const meta = {
  title: 'About/PillarsSection',
  component: PillarsSection,
  parameters: {
    layout: 'fullscreen',
  },
  args: {
    t: (key: string) => placeholderCopy[key] ?? key,
  },
  tags: ['autodocs'],
} satisfies Meta<typeof PillarsSection>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
