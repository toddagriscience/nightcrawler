// Copyright © Todd Agriscience, Inc. All rights reserved.

import { render, screen } from '@testing-library/react';
import { describe, expect, test, vi } from 'vitest';
import { SearchNavForm } from './search-nav-form';

// Stub next/navigation so the component can mount without a real router.
vi.mock('next/navigation', () => ({
  useRouter: () => ({ push: vi.fn() }),
}));

// Stub server action to avoid real DB calls during unit tests.
vi.mock('./actions', () => ({
  fetchDropdownItems: vi.fn().mockResolvedValue({ imps: [], seeds: [] }),
}));

describe('SearchNavForm', () => {
  test('renders a search form with an input and submit button', () => {
    render(<SearchNavForm />);

    const form = screen.getByRole('search', { name: 'Search knowledge base' });
    const input = screen.getByRole('searchbox', {
      name: 'Search knowledge base',
    });
    const submitButton = screen.getByRole('button', { name: 'Search' });

    expect(form).toBeTruthy();
    expect(input).toHaveAttribute('name', 'q');
    expect(input).toHaveAttribute('placeholder', 'Search');
    expect(submitButton).toHaveAttribute('type', 'submit');
  });
});
