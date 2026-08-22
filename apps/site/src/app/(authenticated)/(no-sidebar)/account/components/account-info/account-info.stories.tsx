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
          'Section wrapper shared by every /account page. Subpages pass `backHref` to render a link back to their parent section; the /account index omits it, since the account header already links home.',
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
    title: 'Account',
    description: 'The /account index needs no back link.',
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
