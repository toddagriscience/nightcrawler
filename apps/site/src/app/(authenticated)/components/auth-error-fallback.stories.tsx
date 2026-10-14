// Copyright © Todd Agriscience, Inc. All rights reserved.

import type { Meta, StoryObj } from '@storybook/react-vite';
import AuthErrorFallback from './auth-error-fallback';

const meta: Meta<typeof AuthErrorFallback> = {
  title: 'Authenticated/AuthErrorFallback',
  component: AuthErrorFallback,
  parameters: {
    layout: 'fullscreen',
    nextjs: {
      appDirectory: true,
      navigation: {
        pathname: '/account',
      },
    },
    docs: {
      description: {
        component:
          'Shown when authentication fails, both from the authenticated layout and from its error boundary. The log out action reuses the shared marketing button so its outline styling matches the rest of the site, and the support links give a blocked viewer somewhere to go.',
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof AuthErrorFallback>;

export const Default: Story = {};
