// Copyright © Todd Agriscience, Inc. All rights reserved.

import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import AccountHeader from './account-header';

describe('AccountHeader', () => {
  it('is the account area banner landmark', () => {
    render(<AccountHeader />);

    expect(screen.getAllByRole('banner')).toHaveLength(1);
  });

  it('renders the wordmark home link inside the banner', () => {
    render(<AccountHeader />);

    const wordmark = screen.getByRole('link', {
      name: 'Todd Agriscience home page',
    });

    expect(wordmark).toHaveAttribute('href', '/');
    expect(screen.getByRole('banner')).toContainElement(wordmark);
  });

  it('carries branding only: no separate Home link and no heading', () => {
    render(<AccountHeader />);

    expect(screen.getAllByRole('link')).toHaveLength(1);
    expect(screen.queryByText('Home')).not.toBeInTheDocument();
    expect(screen.queryByRole('heading', { level: 1 })).not.toBeInTheDocument();
  });
});
