// Copyright © Todd Agriscience, Inc. All rights reserved.

import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import AuthErrorPage from './error';

describe('AuthErrorPage', () => {
  it('links to /home', () => {
    render(<AuthErrorPage />);

    const home = screen.getByRole('link', { name: /^home$/i });
    expect(home).toHaveAttribute('href', '/home');
  });

  it('links Status to the public status page', () => {
    render(<AuthErrorPage />);

    const status = screen.getByRole('link', { name: /^status$/i });
    expect(status).toHaveAttribute(
      'href',
      'https://status.toddagriscience.com'
    );
  });
});
