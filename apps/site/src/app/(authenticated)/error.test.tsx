// Copyright © Todd Agriscience, Inc. All rights reserved.

import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import AuthErrorPage from './error';
import { SYSTEM_STATUS_PAGE_URL } from './system-status-url';

describe('AuthErrorPage', () => {
  it('links to /home', () => {
    render(<AuthErrorPage />);

    const home = screen.getByRole('link', { name: /^home$/i });
    expect(home).toHaveAttribute('href', '/home');
  });

  it('links to the system status page in a new tab', () => {
    render(<AuthErrorPage />);

    const status = screen.getByRole('link', { name: /^status$/i });
    expect(status).toHaveAttribute('href', SYSTEM_STATUS_PAGE_URL);
    expect(status).toHaveAttribute('target', '_blank');
    expect(status).toHaveAttribute('rel', 'noopener noreferrer');
  });
});
