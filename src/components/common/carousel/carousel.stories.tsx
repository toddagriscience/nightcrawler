// Copyright Todd LLC, All rights reserved.

import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import NewsCard from '../news-card/news-card';
import Carousel from './carousel';

const meta = {
  title: 'Common/Carousel',
  component: Carousel,
  parameters: {
    layout: 'fullscreen',
  },
  argTypes: {
    isDark: {
      control: 'boolean',
      description: 'Use dark theme colors',
    },
    loop: {
      control: 'boolean',
      description: 'Enable loop mode',
    },
  },
  args: {
    isDark: false,
    loop: true,
    showDots: true,
  },
  tags: ['autodocs'],
} satisfies Meta<typeof Carousel>;

export default meta;
type Story = StoryObj<typeof meta>;

const sampleNewsCards = (isDark: boolean) => (
  <>
    <NewsCard
      image="/images/placeholder.jpg"
      source="Journal"
      date="Apr 15, 2025"
      headline="Todd Announces Partnership with Agricultural Innovation Lab"
      isDark={isDark}
    />
    <NewsCard
      image="/images/placeholder.jpg"
      source="PR Newswire"
      date="Mar 30, 2025"
      headline="Todd Introduces Revolutionary Regenerative Farming Techniques"
      isDark={isDark}
    />
    <NewsCard
      image="/images/placeholder.jpg"
      source="AgTech Weekly"
      date="Feb 12, 2025"
      headline="Sustainable Agriculture Solutions Show Promising Results"
      isDark={isDark}
    />
    <NewsCard
      image="/images/placeholder.jpg"
      source="Farm Journal"
      date="Jan 28, 2025"
      headline="Next Generation of Farming Technology Unveiled"
      isDark={isDark}
    />
  </>
);

export const Default: Story = {
  args: {
    isDark: false,
    children: sampleNewsCards(false),
  },
  render: (args) => (
    <div style={{ padding: '2rem' }}>
      <Carousel {...args}>{args.children}</Carousel>
    </div>
  ),
};

export const DarkMode: Story = {
  args: {
    isDark: true,
    children: sampleNewsCards(true),
  },
  render: (args) => (
    <div style={{ padding: '2rem' }}>
      <Carousel {...args}>{args.children}</Carousel>
    </div>
  ),
};
