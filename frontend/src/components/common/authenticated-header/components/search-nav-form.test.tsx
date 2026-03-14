// Copyright © Todd Agriscience, Inc. All rights reserved.

import { render, screen } from '@testing-library/react';
import { describe, expect, test } from 'vitest';
import { SearchNavForm } from './search-nav-form';

describe('SearchNavForm', () => {
  test('renders a GET form targeting the search page', () => {
    render(<SearchNavForm />);

    const form = screen.getByRole('search', { name: 'Search knowledge base' });
    const input = screen.getByRole('searchbox', {
      name: 'Search knowledge base',
    });
    const submitButton = screen.getByRole('button', { name: 'Search' });

    expect(form).toHaveAttribute('action', '/search');
    expect(form).toHaveAttribute('method', 'GET');
    expect(input).toHaveAttribute('name', 'q');
    expect(input).toHaveAttribute('placeholder', 'Search');
    expect(submitButton).toHaveAttribute('type', 'submit');
  });
});
