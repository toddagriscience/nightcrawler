// Copyright © Todd Agriscience, Inc. All rights reserved.

import type { Meta, StoryObj } from '@storybook/react-vite';
import { NextIntlClientProvider } from 'next-intl';
import enMessages from '@/messages/forms/en.json';
import esMessages from '@/messages/forms/es.json';
import { FormSuccess } from './form-success';

const meta: Meta<typeof FormSuccess> = {
  title: 'Marketing/Forms/FormSuccess',
  component: FormSuccess,
  decorators: [
    (Story, context) => {
      const locale = context.globals.locale === 'es' ? 'es' : 'en';
      return (
        <NextIntlClientProvider
          locale={locale}
          messages={locale === 'es' ? esMessages : enMessages}
        >
          <Story />
        </NextIntlClientProvider>
      );
    },
  ],
  parameters: { layout: 'fullscreen' },
};

export default meta;
type Story = StoryObj<typeof FormSuccess>;

export const Default: Story = {};

export const SeededCmsCopy: Story = {
  args: {
    title: 'Request received',
    message:
      'Thank you. Our team will review your request and follow up by email.',
  },
};

export const CustomCmsCopy: Story = {
  args: {
    title: 'Application received',
    message: 'Watch your inbox for next steps.',
  },
};
