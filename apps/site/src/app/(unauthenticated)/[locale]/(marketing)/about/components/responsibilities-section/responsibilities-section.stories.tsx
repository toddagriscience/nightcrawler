// Copyright © Todd Agriscience, Inc. All rights reserved.

import type { Meta, StoryObj } from '@storybook/react-vite';
import ResponsibilitiesSection from './responsibilities-section';

const placeholderCopy: Record<string, string> = {
  'responsibilities.title': 'Responsibilities',
  'responsibilities.subtitle':
    'We work with self-supporting farms that value the Todd team’s ability to affect change in these areas.',
  'responsibilities.items.0.heading': 'Disciplined Data Selection',
  'responsibilities.items.0.description':
    'We utilize proprietary analytic frameworks and digital capabilities to understand disease dynamics and insect mitigation holistically, enabling responsible farm management decisions.',
  'responsibilities.items.1.heading': 'Company Philosophy',
  'responsibilities.items.1.description':
    'We are assembling a firm designed to emulate the consumer bases of our farms, embracing a holistic pace of life that nourishes the natural character of individuals, communities and the earth, in order to take what we believe to be the best path forward.',
  'responsibilities.items.2.heading': 'Farm Integration',
  'responsibilities.items.2.description':
    'By concentrating on a small group of farms across our categories of management, we strive to support clearly defined goals centered on responsibility, sustainability, and long-term improvement.',
  'responsibilities.items.3.heading': 'Market Development & Consumer Awareness',
  'responsibilities.items.3.description':
    'We leverage our team’s complementary entrepreneurial experience to explore direct-to-consumer channels, including CSA and other market-entry strategies that strengthen consumer connection and brand awareness.',
  'responsibilities.items.4.heading': 'Regulatory & Policy Engagement',
  'responsibilities.items.4.description':
    'We actively monitor our farms’ regulatory obligations and play an essential role in the formulation and implementation of policies governing the worldwide agriculture industry through accountability, positions, and leadership.',
};

const meta = {
  title: 'About/ResponsibilitiesSection',
  component: ResponsibilitiesSection,
  parameters: {
    layout: 'fullscreen',
  },
  args: {
    t: (key: string) => placeholderCopy[key] ?? key,
  },
  tags: ['autodocs'],
} satisfies Meta<typeof ResponsibilitiesSection>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
