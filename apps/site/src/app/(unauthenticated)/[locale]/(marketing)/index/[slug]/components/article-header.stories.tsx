// Copyright © Todd Agriscience, Inc. All rights reserved.

import type { Meta, StoryObj } from '@storybook/react-vite';
import { ArticleHeader } from './article-header';

const meta: Meta<typeof ArticleHeader> = {
  title: 'Marketing/Article/Header',
  component: ArticleHeader,
  args: {
    title: 'Developing varieties for taste and nutrition',
    summary:
      'Todd’s crop research explores varieties with useful traits for sustainable farms.',
    dateTime: '2026-08-20T19:44:28Z',
    formattedDate: '20 August, 2026',
  },
};
export default meta;
type Story = StoryObj<typeof meta>;
export const Published: Story = {};
export const Updated: Story = {
  args: {
    modifiedDateTime: '2026-09-01T12:00:00Z',
    formattedModifiedDate: '1 September, 2026',
  },
};
