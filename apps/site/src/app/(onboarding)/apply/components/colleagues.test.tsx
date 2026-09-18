// Copyright © Todd Agriscience, Inc. All rights reserved.

import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import ResizeObserver from 'resize-observer-polyfill';
import Colleagues from '@/app/(onboarding)/apply/components/colleagues';
import { ApplicationContext } from '@/app/(onboarding)/apply/components/onboarding-context';
import { ONBOARDING_CONTEXT } from '@/app/(onboarding)/apply/components/onboarding-fixtures';
import type { OnboardingContextValue } from '@/app/(onboarding)/apply/types';

const invite = vi.fn(ONBOARDING_CONTEXT.actions.inviteUserToFarm);
const advance = vi.fn(async () => {});
const addedBrowserMethods: string[] = [];
function renderWithContext(overrides: Partial<OnboardingContextValue> = {}) {
  return render(
    <ApplicationContext.Provider
      value={{
        ...ONBOARDING_CONTEXT,
        actions: { ...ONBOARDING_CONTEXT.actions, inviteUserToFarm: invite },
        completeTeamStep: advance,
        ...overrides,
      }}
    >
      <Colleagues />
    </ApplicationContext.Provider>
  );
}

describe('Colleagues', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.stubGlobal('ResizeObserver', ResizeObserver);
    for (const method of [
      'hasPointerCapture',
      'setPointerCapture',
      'releasePointerCapture',
      'scrollIntoView',
    ]) {
      if (!(method in HTMLElement.prototype)) {
        Object.defineProperty(HTMLElement.prototype, method, {
          configurable: true,
          value: vi.fn(() => false),
        });
        addedBrowserMethods.push(method);
      }
    }
    invite.mockImplementation(ONBOARDING_CONTEXT.actions.inviteUserToFarm);
    advance.mockResolvedValue(undefined);
  });
  afterEach(() => {
    vi.unstubAllGlobals();
    for (const method of addedBrowserMethods.splice(0)) {
      Reflect.deleteProperty(HTMLElement.prototype, method);
    }
  });

  it('renders optional team invitations with accessible field labels', () => {
    renderWithContext();
    expect(
      screen.getByRole('heading', { name: 'Add people' })
    ).toBeInTheDocument();
    expect(screen.getByLabelText('First Name')).toBeInTheDocument();
    expect(screen.getByLabelText('Last Name')).toBeInTheDocument();
    expect(screen.getByLabelText('Email')).toBeInTheDocument();
    expect(screen.getByRole('combobox', { name: 'Role' })).toBeInTheDocument();
    expect(screen.queryByText('I am an administrator')).not.toBeInTheDocument();
  });

  it('continues with no invitations and does not submit the empty invite form', async () => {
    const user = userEvent.setup();
    renderWithContext();
    const button = screen.getByRole('button', { name: 'Continue' });
    expect(button).toHaveAttribute('type', 'button');
    expect(button.closest('form')).toBeNull();
    await user.click(button);
    expect(advance).toHaveBeenCalledOnce();
    expect(invite).not.toHaveBeenCalled();
    expect(screen.queryByRole('alert')).not.toBeInTheDocument();
  });

  it('keeps a partially entered invitation from being sent by Continue', async () => {
    const user = userEvent.setup();
    renderWithContext();
    await user.type(screen.getByLabelText('First Name'), 'Sam');
    await user.click(screen.getByRole('button', { name: 'Continue' }));
    expect(advance).toHaveBeenCalledOnce();
    expect(invite).not.toHaveBeenCalled();
  });

  it('shows a persistence error and permits retrying Continue', async () => {
    const user = userEvent.setup();
    advance.mockRejectedValueOnce(new Error('Could not save team progress.'));
    renderWithContext();
    await user.click(screen.getByRole('button', { name: 'Continue' }));
    expect(await screen.findByRole('alert')).toHaveTextContent(
      'Could not save team progress.'
    );
    await user.click(screen.getByRole('button', { name: 'Continue' }));
    expect(advance).toHaveBeenCalledTimes(2);
    expect(screen.queryByRole('alert')).not.toBeInTheDocument();
  });

  it('disables Continue while its progress update is pending', async () => {
    const user = userEvent.setup();
    let finish: () => void = () => {};
    advance.mockImplementationOnce(
      () =>
        new Promise<void>((resolve) => {
          finish = resolve;
        })
    );
    renderWithContext();
    await user.click(screen.getByRole('button', { name: 'Continue' }));
    expect(
      await screen.findByRole('button', { name: 'Continuing…' })
    ).toBeDisabled();
    expect(
      screen.getByRole('button', { name: 'Invite Team Member' })
    ).toBeDisabled();
    finish();
    await waitFor(() =>
      expect(screen.getByRole('button', { name: 'Continue' })).toBeEnabled()
    );
  });

  it('preserves existing team members when returning from payment', () => {
    renderWithContext({
      allUsers: [ONBOARDING_CONTEXT.currentUser],
      invitedUserVerificationStatus: [
        { email: 'alex@example.com', verified: true },
      ],
    });
    expect(screen.getByText('Alex Rivera')).toBeInTheDocument();
    expect(screen.getByText('Verified')).toBeInTheDocument();
    expect(
      screen.queryByRole('button', { name: 'Remove Alex Rivera' })
    ).not.toBeInTheDocument();
  });

  it('does not expose invitation controls for read-only users', () => {
    renderWithContext({ canEditFarm: false });
    expect(screen.getByText(/your account is read only/i)).toBeInTheDocument();
    expect(
      screen.queryByRole('button', { name: 'Continue' })
    ).not.toBeInTheDocument();
    expect(
      screen.queryByRole('button', { name: 'Invite Team Member' })
    ).not.toBeInTheDocument();
  });

  it('adds a successful invitation without advancing the onboarding step', async () => {
    const user = userEvent.setup();
    renderWithContext();
    await user.type(screen.getByLabelText('First Name'), 'Sam');
    await user.type(screen.getByLabelText('Last Name'), 'Chen');
    await user.type(screen.getByLabelText('Email'), 'sam@example.com');
    await user.click(screen.getByRole('combobox', { name: 'Role' }));
    await user.click(
      screen.getByRole('option', { name: /Viewers can only view/i })
    );
    await user.click(
      screen.getByRole('button', { name: 'Invite Team Member' })
    );
    expect(await screen.findByText('Sam Chen')).toBeInTheDocument();
    expect(invite).toHaveBeenCalledWith(
      expect.objectContaining({
        firstName: 'Sam',
        lastName: 'Chen',
        email: 'sam@example.com',
        role: 'Viewer',
      })
    );
    expect(advance).not.toHaveBeenCalled();
    expect(screen.getByLabelText('First Name')).toHaveValue('');
  });

  it('shows invitation errors without discarding the entered details', async () => {
    const user = userEvent.setup();
    invite.mockRejectedValueOnce(
      new Error('This email already has an invitation.')
    );
    renderWithContext();
    await user.type(screen.getByLabelText('First Name'), 'Sam');
    await user.type(screen.getByLabelText('Last Name'), 'Chen');
    await user.type(screen.getByLabelText('Email'), 'sam@example.com');
    await user.click(screen.getByRole('combobox', { name: 'Role' }));
    await user.click(
      screen.getByRole('option', { name: /Viewers can only view/i })
    );
    await user.click(
      screen.getByRole('button', { name: 'Invite Team Member' })
    );
    expect(await screen.findByRole('alert')).toHaveTextContent(
      'This email already has an invitation.'
    );
    expect(screen.getByLabelText('First Name')).toHaveValue('Sam');
    expect(advance).not.toHaveBeenCalled();
  });
});
