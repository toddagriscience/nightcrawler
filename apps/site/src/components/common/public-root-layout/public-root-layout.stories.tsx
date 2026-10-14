// Copyright © Todd Agriscience, Inc. All rights reserved.

import type { Meta, StoryObj } from '@storybook/react-vite';
import { renderToStaticMarkup } from 'react-dom/server';
import PublicRootLayout from './public-root-layout';

const meta = {
  title: 'Common/Public root document',
  component: PublicRootLayout,
  args: { locale: 'en', children: null },
  render: ({ locale }) => (
    <iframe
      title={`Document language: ${locale}`}
      className="h-56 w-full"
      srcDoc={renderToStaticMarkup(
        <PublicRootLayout locale={locale}>
          <main>
            <h1>
              {locale === 'es' ? 'Documento en español' : 'English document'}
            </h1>
          </main>
        </PublicRootLayout>
      )}
    />
  ),
} satisfies Meta<typeof PublicRootLayout>;

export default meta;
type Story = StoryObj<typeof meta>;
export const English: Story = {};
export const Spanish: Story = { args: { locale: 'es' } };
