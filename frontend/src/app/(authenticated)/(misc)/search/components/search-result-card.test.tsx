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
          articleType: 'imp',
          category: 'soil',
          source: 'Todd Field Guide',
          createdAt: new Date('2026-03-10T12:00:00Z'),
          updatedAt: new Date('2026-03-10T12:00:00Z'),
          embedding: null,
        }}
      />
    );

    expect(
      screen.getByRole('link', { name: /north block spring imp/i })
    ).toHaveAttribute('href', '/imp/north-block-spring-imp');
    expect(screen.getByText('IMP')).toBeInTheDocument();
  });
});
