// Copyright © Todd Agriscience, Inc. All rights reserved.

import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import AccountPasswordResetInline from './account-password-reset-inline';

vi.mock('@/lib/actions/auth', () => ({
  updateUser: vi.fn(async () => ({ error: null })),
}));

describe('AccountPasswordResetInline', () => {
  it('expands when password row is clicked', async () => {
    const user = userEvent.setup();
    render(<AccountPasswordResetInline />);

    expect(screen.queryByLabelText('Current Password')).not.toBeInTheDocument();
    expect(screen.getByText('Update Password')).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: /Password/i }));

    expect(screen.getByLabelText('Current Password')).toBeInTheDocument();
    expect(screen.getByLabelText('New Password')).toBeInTheDocument();
    expect(screen.getByLabelText('Confirm New Password')).toBeInTheDocument();
    expect(screen.queryByText('Update Password')).not.toBeInTheDocument();
  });

  it('shows min length validation and only enables save for valid matching values', async () => {
    const user = userEvent.setup();
    render(<AccountPasswordResetInline />);

    await user.click(screen.getByRole('button', { name: /Password/i }));

    const newPassword = screen.getByLabelText('New Password');
    const confirmPassword = screen.getByLabelText('Confirm New Password');
    const saveButton = screen.getByRole('button', { name: 'Save' });

    await user.type(newPassword, 'short');
    await user.type(confirmPassword, 'short');

    expect(
      screen.getAllByText('Password required a minimum of 10 characters.')
    ).toHaveLength(2);
    expect(saveButton).toBeDisabled();

    await user.clear(newPassword);
    await user.clear(confirmPassword);
    await user.type(newPassword, 'LongEnough10!');
    await user.type(confirmPassword, 'LongEnough10!');

    expect(saveButton).toBeEnabled();
  });

  it('toggles input visibility', async () => {
    const user = userEvent.setup();
    render(<AccountPasswordResetInline />);

    await user.click(screen.getByRole('button', { name: /Password/i }));

    const currentPassword = screen.getByLabelText(
      'Current Password'
    ) as HTMLInputElement;
    expect(currentPassword.type).toBe('password');

    await user.click(
      screen.getByRole('button', { name: 'Show Current Password' })
    );
    expect(currentPassword.type).toBe('text');

    await user.click(
      screen.getByRole('button', { name: 'Hide Current Password' })
    );
    expect(currentPassword.type).toBe('password');
  });
});
