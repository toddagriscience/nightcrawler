// Copyright © Todd Agriscience, Inc. All rights reserved.

import enMessages from '@/messages/varieties/en.json';
import esMessages from '@/messages/varieties/es.json';
import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { NextIntlClientProvider } from 'next-intl';
import { describe, expect, it, vi } from 'vitest';
import type { PublicVariety } from '../types';
import { VarietyPublicList } from './variety-public-list';

// Use the real provider so ICU parameters and Spanish translations are checked.
vi.mock('next-intl', async (importOriginal) =>
  importOriginal<typeof import('next-intl')>()
);

const items: PublicVariety[] = [
  {
    id: 1260,
    name: 'CANARY BIRD',
    description: 'Rich canary yellow pods.',
    cropName: 'BEAN',
    status: 'available',
  },
  {
    id: 1261,
    name: 'MAYFLOWER',
    description: 'Climbing plants with speckled seeds.',
    cropName: 'BEAN',
    status: 'back_order',
  },
  {
    id: 1262,
    name: 'BEURRÉ DE ROCQUENCOURT',
    description: null,
    cropName: 'BEAN',
    status: 'reference',
  },
  {
    id: 1263,
    name: 'LONG PURPLE',
    description: 'Elongated purple fruit.',
    cropName: 'EGGPLANT',
    status: 'available',
  },
];

describe('VarietyPublicList', () => {
  it.each([
    {
      locale: 'en',
      messages: enMessages,
      request: 'Request',
      reference: 'Reference',
      count: 'Showing 4 varieties of 4',
    },
    {
      locale: 'es',
      messages: esMessages,
      request: 'Solicitar',
      reference: 'Referencia',
      count: 'Mostrando 4 variedades de 4',
    },
  ])(
    'offers requests for inventory but labels historical references in $locale',
    ({ locale, messages, request, reference, count }) => {
      render(
        <NextIntlClientProvider
          locale={locale}
          messages={messages}
          timeZone="UTC"
        >
          <VarietyPublicList items={items} />
        </NextIntlClientProvider>
      );

      for (const name of ['CANARY BIRD', 'MAYFLOWER', 'LONG PURPLE']) {
        const link = screen.getByRole('link', { name: `${request} ${name}` });
        expect(link).toHaveAttribute('href', '/contact');
        expect(link).toHaveTextContent(request);
      }

      expect(screen.getAllByRole('link')).toHaveLength(3);
      const referenceRow = screen
        .getByText('BEURRÉ DE ROCQUENCOURT')
        .closest('li');
      expect(referenceRow).not.toBeNull();
      expect(within(referenceRow!).getByText(reference)).toBeInTheDocument();
      expect(within(referenceRow!).queryByRole('link')).not.toBeInTheDocument();
      expect(screen.getByRole('status')).toHaveTextContent(count);
      expect(screen.getByRole('status')).toHaveAttribute('aria-live', 'polite');
    }
  );

  it.each([
    ['  bIrD  ', 'CANARY BIRD'],
    ['  cLiMbInG  ', 'MAYFLOWER'],
    ['  eGgPlAnT  ', 'LONG PURPLE'],
  ])('searches names, descriptions and crops for %s', async (query, name) => {
    const user = userEvent.setup();
    render(
      <NextIntlClientProvider locale="en" messages={enMessages} timeZone="UTC">
        <VarietyPublicList items={items} />
      </NextIntlClientProvider>
    );

    await user.type(
      screen.getByRole('searchbox', { name: 'Search varieties' }),
      query
    );

    expect(screen.getAllByRole('listitem')).toHaveLength(1);
    expect(screen.getByText(name)).toBeInTheDocument();
    expect(screen.getByRole('status')).toHaveTextContent(
      'Showing 1 varieties of 4'
    );
  });

  it('combines filters and search, shows no matches, and restores all rows when cleared', async () => {
    const user = userEvent.setup();
    render(
      <NextIntlClientProvider locale="en" messages={enMessages} timeZone="UTC">
        <VarietyPublicList items={items} />
      </NextIntlClientProvider>
    );

    await user.click(screen.getByRole('button', { name: 'Filter by crop' }));
    await user.click(screen.getByRole('menuitemradio', { name: 'BEAN' }));
    expect(screen.getAllByRole('listitem')).toHaveLength(3);

    await user.click(
      screen.getByRole('button', { name: 'Filter by availability' })
    );
    await user.click(screen.getByRole('menuitemradio', { name: 'Back order' }));
    expect(screen.getAllByRole('listitem')).toHaveLength(1);
    expect(screen.getByText('MAYFLOWER')).toBeInTheDocument();

    const search = screen.getByRole('searchbox', { name: 'Search varieties' });
    await user.type(search, 'canary');
    expect(screen.queryByRole('list')).not.toBeInTheDocument();
    expect(
      screen.getByText('No varieties match these filters.')
    ).toHaveAttribute('role', 'status');
    expect(screen.getByText('Showing 0 varieties of 4')).toHaveAttribute(
      'aria-live',
      'polite'
    );

    await user.clear(search);
    expect(screen.getByText('MAYFLOWER')).toBeInTheDocument();
    await user.click(
      screen.getByRole('button', { name: 'Filter by availability' })
    );
    await user.click(
      screen.getByRole('menuitemradio', { name: 'Availability' })
    );
    expect(screen.getAllByRole('listitem')).toHaveLength(3);
    await user.click(screen.getByRole('button', { name: 'Filter by crop' }));
    await user.click(screen.getByRole('menuitemradio', { name: 'All crops' }));

    expect(screen.getAllByRole('listitem')).toHaveLength(4);
    expect(
      screen.queryByText('No varieties match these filters.')
    ).not.toBeInTheDocument();
    expect(screen.getByRole('status')).toHaveTextContent(
      'Showing 4 varieties of 4'
    );
  });
});
