// Copyright © Todd Agriscience, Inc. All rights reserved.

import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import AccountPrivacyPage from './page';

describe('AccountPrivacyPage', () => {
  it('renders the requested privacy links to the right routes', () => {
    render(<AccountPrivacyPage />);

    expect(
      screen.getByRole('link', { name: /Request Personal Data/i })
    ).toHaveAttribute('href', '/contact');
    expect(
      screen.getByRole('link', { name: /Request Data Deletion/i })
    ).toHaveAttribute('href', '/contact');
    expect(
      screen.getByRole('link', { name: /Privacy Policy/i })
    ).toHaveAttribute('href', '/privacy');
  });

  it('owns the only h1, so the shell main region has a heading', () => {
    render(<AccountPrivacyPage />);

    expect(screen.getAllByRole('heading', { level: 1 })).toHaveLength(1);
    expect(
      screen.getByRole('heading', { level: 1, name: 'Privacy' })
    ).toBeInTheDocument();
  });
});
