// Copyright © Todd Agriscience, Inc. All rights reserved.

import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import AccountSecurityPage from './page';

vi.mock('@/components/common/utils/logout-link/logout-link', () => ({
  default: ({ label }: { label?: string }) => (
    <button type="button">{label ?? 'Logout'}</button>
  ),
}));

describe('AccountSecurityPage', () => {
  it('renders security actions and reset password link', () => {
    render(<AccountSecurityPage />);

    expect(screen.getByText('Devices')).toBeInTheDocument();
    expect(screen.getByText('Passkeys')).toBeInTheDocument();
    expect(
      screen.getByRole('link', { name: 'Update Password' })
    ).toHaveAttribute('href', '/account/reset-password');
    expect(screen.getByRole('button', { name: 'Log out' })).toBeInTheDocument();
  });
});
