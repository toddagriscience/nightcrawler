// Copyright © Todd Agriscience, Inc. All rights reserved.

import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import AccountSecurityPage from './page';

vi.mock('@/components/common/utils/logout-link/logout-link', () => ({
  default: ({ label }: { label?: string }) => (
    <button type="button">{label ?? 'Logout'}</button>
  ),
}));

describe('AccountSecurityPage', () => {
  it('renders security actions and expands inline password reset', async () => {
    const user = userEvent.setup();
    render(<AccountSecurityPage />);

    expect(screen.getByText('Devices')).toBeInTheDocument();
    expect(screen.getByText('Passkeys')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Log out' })).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: /Password/i }));
    expect(screen.getByLabelText('Current Password')).toBeInTheDocument();
  });
});
