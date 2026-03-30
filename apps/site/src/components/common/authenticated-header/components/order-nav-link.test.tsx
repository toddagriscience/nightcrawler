// Copyright © Todd Agriscience, Inc. All rights reserved.

import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { beforeEach, describe, expect, test } from 'vitest';
import { OrderNavLink } from './order-nav-link';

describe('OrderNavLink', () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  test('stays hidden when the local order is empty', () => {
    render(<OrderNavLink />);

    expect(
      screen.queryByRole('link', { name: /order/i })
    ).not.toBeInTheDocument();
  });

  test('renders the order link when items exist in local storage', () => {
    window.localStorage.setItem(
      'nightcrawler-order',
      JSON.stringify({
        items: [
          {
            seedProductId: 1,
            slug: 'crimson-clover',
            name: 'Crimson Clover',
            description: 'Seed product',
            stock: 8,
            imageUrl: null,
            unit: 'bag',
            priceInCents: 1899,
            quantity: 2,
          },
        ],
        updatedAt: '2026-03-18T00:00:00.000Z',
      })
    );

    render(<OrderNavLink />);

    expect(screen.getByRole('link', { name: /order/i })).toHaveAttribute(
      'href',
      '/order'
    );
    expect(screen.getByText('2')).toBeInTheDocument();
  });
});
