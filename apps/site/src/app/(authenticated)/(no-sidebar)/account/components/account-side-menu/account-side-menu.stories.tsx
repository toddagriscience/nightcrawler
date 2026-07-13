// Copyright © Todd Agriscience, Inc. All rights reserved.

import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import AccountSideMenu from './account-side-menu';

const meta: Meta<typeof AccountSideMenu> = {
  title: 'Account/AccountSideMenu',
  component: AccountSideMenu,
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
          'Left-hand navigation for the account area. Lists the account sections and, in the bottom utility group, a Help link to the support page (/contact) above the Log out action.',
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
