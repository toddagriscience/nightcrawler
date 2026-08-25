// Copyright © Todd Agriscience, Inc. All rights reserved.

import type { Meta, StoryObj } from '@storybook/react-vite';
import AccountSideMenu from './account-side-menu';

const meta: Meta<typeof AccountSideMenu> = {
  title: 'Account/AccountSideMenu',
  component: AccountSideMenu,
  args: {
    farmName: 'Blue River Farm',
    contactName: 'Jane Farmer',
    contactEmail: 'jane@example.com',
    contactPhone: '+15551234567',
  },
  parameters: {
    layout: 'padded',
    nextjs: {
      appDirectory: true,
      navigation: {
        pathname: '/account',
      },
    },
    docs: {
      description: {
        component:
          'Left-hand navigation for the account area. Leads with a Home link out of the account tree, then the farm name (an h2 naming the aside) above the primary contact details (email and phone become mailto:/tel: links only when they are actually mailable/dialable), then the account sections and, in the bottom utility group, a Help link to the support page (/contact) above the Log out action.',
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof AccountSideMenu>;

export const Default: Story = {};

export const PrivacyActive: Story = {
  parameters: {
    nextjs: {
      appDirectory: true,
      navigation: {
        pathname: '/account/privacy',
      },
    },
  },
};

export const MissingContactDetails: Story = {
  args: {
    contactName: 'Not set',
    contactEmail: 'Not set',
    contactPhone: 'Not set',
  },
};
