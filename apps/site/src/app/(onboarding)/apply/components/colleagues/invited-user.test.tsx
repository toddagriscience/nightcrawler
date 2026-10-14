// Copyright © Todd Agriscience, Inc. All rights reserved.

import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import InvitedUser from '@/app/(onboarding)/apply/components/colleagues/invited-user';
import { ApplicationContext } from '@/app/(onboarding)/apply/components/onboarding-context';
import { ONBOARDING_CONTEXT } from '@/app/(onboarding)/apply/components/onboarding-fixtures';
import type { InvitedUserProps } from '@/app/(onboarding)/apply/components/types';

const resend = vi.fn(ONBOARDING_CONTEXT.actions.resendVerificationEmail);
const remove = vi.fn(ONBOARDING_CONTEXT.actions.uninviteUser);
const onUninvited = vi.fn();
function renderMember(overrides: Partial<InvitedUserProps> = {}) {
  return render(
    <ApplicationContext.Provider
      value={{
        ...ONBOARDING_CONTEXT,
        actions: {
          ...ONBOARDING_CONTEXT.actions,
          resendVerificationEmail: resend,
          uninviteUser: remove,
        },
      }}
    >
      <InvitedUser
        invitedUser={ONBOARDING_CONTEXT.currentUser}
        isVerified={false}
        canEditFarm
        onUninvited={onUninvited}
        {...overrides}
      />
    </ApplicationContext.Provider>
  );
}

describe('InvitedUser', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    resend.mockImplementation(
      ONBOARDING_CONTEXT.actions.resendVerificationEmail
    );
    remove.mockImplementation(ONBOARDING_CONTEXT.actions.uninviteUser);
  });

  it('uses accessible names for its invitation controls', () => {
    renderMember();
    expect(screen.getByText('Alex Rivera')).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: 'Resend invitation to Alex Rivera' })
    ).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: 'Remove Alex Rivera' })
    ).toBeInTheDocument();
  });

  it('resends an invite through the provided action and prevents immediate duplicates', async () => {
    const user = userEvent.setup();
    renderMember();
    await user.click(
      screen.getByRole('button', { name: 'Resend invitation to Alex Rivera' })
    );
    expect(resend).toHaveBeenCalledWith('alex@example.com');
    expect(
      screen.getByRole('button', { name: 'Resend invitation to Alex Rivera' })
    ).toBeDisabled();
  });

  it('shows resend errors and enables retry', async () => {
    const user = userEvent.setup();
    resend.mockRejectedValueOnce(new Error('Unable to send invitation.'));
    renderMember();
    await user.click(
      screen.getByRole('button', { name: 'Resend invitation to Alex Rivera' })
    );
    expect(await screen.findByRole('alert')).toHaveTextContent(
      'Unable to send invitation.'
    );
    expect(
      screen.getByRole('button', { name: 'Resend invitation to Alex Rivera' })
    ).toBeEnabled();
  });

  it('updates the list only after an invitation is removed on the server', async () => {
    const user = userEvent.setup();
    renderMember();
    await user.click(
      screen.getByRole('button', { name: 'Remove Alex Rivera' })
    );
    await waitFor(() => expect(remove).toHaveBeenCalledWith(1));
    expect(onUninvited).toHaveBeenCalledWith(1);
  });

  it('retains the user when removal fails', async () => {
    const user = userEvent.setup();
    remove.mockRejectedValueOnce(new Error('Unable to remove invitation.'));
    renderMember();
    await user.click(
      screen.getByRole('button', { name: 'Remove Alex Rivera' })
    );
    expect(await screen.findByRole('alert')).toHaveTextContent(
      'Unable to remove invitation.'
    );
    expect(onUninvited).not.toHaveBeenCalled();
  });

  it('does not let the applicant remove their own account', () => {
    renderMember({ isCurrentUser: true, isVerified: true });
    expect(screen.queryByRole('button')).not.toBeInTheDocument();
  });

  it('does not expose mutation controls to read-only users', () => {
    renderMember({ canEditFarm: false });
    expect(screen.queryByRole('button')).not.toBeInTheDocument();
  });
});
