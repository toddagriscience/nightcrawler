// Copyright © Todd Agriscience, Inc. All rights reserved.

import type { Meta, StoryObj } from '@storybook/react-vite';
import PolicyBody from './components/policy-body';
import PolicyList from './components/policy-list';
import PolicySection from './components/policy-section';
import PolicySubheading from './components/policy-subheading';
import TermsPoliciesPage from './terms-policies-page';

const meta = {
  title: 'Common/TermsPoliciesPage',
  component: TermsPoliciesPage,
  parameters: {
    layout: 'fullscreen',
  },
  tags: ['autodocs'],
  argTypes: {
    title: {
      control: { type: 'text' },
      description: 'Page heading rendered as the h1',
    },
    className: {
      control: { type: 'text' },
      description: 'Extra classes merged onto the page container',
    },
  },
} satisfies Meta<typeof TermsPoliciesPage>;

export default meta;
type Story = StoryObj<typeof meta>;

/** The full block vocabulary as the three policy pages compose it. */
export const Default: Story = {
  args: {
    title: 'Terms of Use',
    children: (
      <div className="space-y-12">
        <PolicySection title="Terms and Conditions">
          <div className="space-y-8">
            <PolicyBody>
              Please read these Terms of Use carefully before using the Site.
            </PolicyBody>
            <PolicyBody>
              Todd may amend these Terms of Use from time to time.
            </PolicyBody>
          </div>
        </PolicySection>

        <PolicySection title="Your Rights">
          <PolicySubheading>Requesting disclosure</PolicySubheading>
          <PolicyBody>
            You may request the categories of information we collect.
          </PolicyBody>
          <PolicyList
            className="mt-2"
            items={[
              'Categories of personal information collected',
              'Business purpose for collecting it',
              'Categories of third parties it is shared with',
            ]}
          />
        </PolicySection>
      </div>
    ),
  },
};

/** Numbered variant used by the Japan supplement in the privacy policy. */
export const OrderedList: Story = {
  args: {
    title: 'Privacy Policy',
    children: (
      <PolicySection title="Information Request">
        <PolicyBody>Please include the following in your request:</PolicyBody>
        <PolicyList
          className="mt-2"
          ordered
          items={['Your full name', 'Your address', 'Your contact details']}
        />
      </PolicySection>
    ),
  },
};
