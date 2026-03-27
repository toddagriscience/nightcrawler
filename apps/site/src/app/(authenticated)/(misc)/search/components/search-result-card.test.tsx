// Copyright © Todd Agriscience, Inc. All rights reserved.

import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { describe, expect, test } from 'vitest';
import { SearchResultCard } from './search-result-card';

describe('SearchResultCard', () => {
  test('links IMP search results to the IMP detail page', () => {
    render(
      <SearchResultCard
        result={{
          id: 14,
          title: 'North Block Spring IMP',
          slug: 'north-block-spring-imp',
          content: 'Apply compost in the first week of March.',
          resultType: 'imp',
          category: 'soil',
          source: 'Todd Field Guide',
          similarity: 0.62,
          stock: null,
          priceInCents: null,
          unit: null,
        }}
      />
    );

    expect(
      screen.getByRole('link', { name: /north block spring imp/i })
    ).toHaveAttribute('href', '/imp/north-block-spring-imp');
    expect(screen.getByText('IMP')).toBeInTheDocument();
  });

  test('links seed search results to the seed product detail page', () => {
    render(
      <SearchResultCard
        result={{
          id: 9,
          title: 'Crimson Clover',
          slug: 'crimson-clover',
          content: 'Cool-season annual legume for cover crop programs.',
          resultType: 'seed',
          category: 'seed products',
          source: 'Todd Seed Catalog',
          similarity: 0.71,
          stock: 24,
          priceInCents: 1899,
          unit: 'bag',
        }}
      />
    );

    expect(
      screen.getByRole('link', { name: /crimson clover/i })
    ).toHaveAttribute('href', '/product/crimson-clover');
    expect(screen.getByText('Seed')).toBeInTheDocument();
    expect(
      screen.getByText(/\$18\.99 \/ bag · 24 in stock/i)
    ).toBeInTheDocument();
  });
});
