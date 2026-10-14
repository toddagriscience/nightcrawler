// Copyright © Todd Agriscience, Inc. All rights reserved.

import type { Meta, StoryObj } from '@storybook/react-vite';
import AccountInfo, {
  AccountInfoRow,
  AccountInfoSection,
} from './account-info';

const meta: Meta<typeof AccountInfo> = {
  title: 'Account/AccountInfo',
  component: AccountInfo,
  parameters: {
    layout: 'padded',
    nextjs: {
      appDirectory: true,
      navigation: {
        pathname: '/account/privacy',
      },
    },
    docs: {
      description: {
        component:
          'Section wrapper shared by every /account page. `backHref` renders a back link, and is passed only on pages the account side menu cannot reach directly — farm/profile and a zone detail page. Menu-linked sections omit it, since the menu already routes back in one click.',
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof AccountInfo>;

export const WithBackLink: Story = {
  args: {
    title: 'Privacy',
    description: 'Manage how your data is used.',
    backHref: '/account',
    children: (
      <div className="border-t border-[#D9D9D9]">
        <AccountInfoRow label="Personal Information Sharing" value="Disabled" />
        <AccountInfoRow label="Privacy Policy" value="View" href="/privacy" />
      </div>
    ),
  },
};

export const WithoutBackLink: Story = {
  args: {
    title: 'Security',
    description: 'Menu-linked sections need no back link.',
    children: (
      <AccountInfoSection title="Overview">
        <AccountInfoRow label="Farm" value="Example Farm" />
      </AccountInfoSection>
    ),
  },
};

export const CustomBackLabel: Story = {
  args: {
    title: 'North field',
    description: 'View management zone details.',
    backHref: '/account/management-zones',
    backLabel: 'Management zones',
    children: (
      <AccountInfoSection title="Overview">
        <AccountInfoRow label="Acreage" value="42" />
      </AccountInfoSection>
    ),
  },
};
