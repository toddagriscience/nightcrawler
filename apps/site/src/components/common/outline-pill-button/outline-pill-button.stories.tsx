// Copyright © Todd Agriscience, Inc. All rights reserved.

import type { Meta, StoryObj } from '@storybook/react-vite';
import NextLink from 'next/link';
import { OutlinePillButton } from './outline-pill-button';

const meta = {
  component: OutlinePillButton,
  title: 'Common/OutlinePillButton',
  args: { children: 'Explore research' },
} satisfies Meta<typeof OutlinePillButton>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = {};
export const Disabled: Story = { args: { disabled: true } };
export const Link: Story = {
  render: () => (
    <OutlinePillButton asChild>
      <NextLink href="/research">Explore research</NextLink>
    </OutlinePillButton>
  ),
};
