// Copyright © Todd Agriscience, Inc. All rights reserved.

import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import SetPasswordStep from '@/app/(onboarding)/apply/components/set-password-step';
import type { OnboardingActions } from '@/app/(onboarding)/apply/types';

const applicant = {
  applicationId: 42,
  token: 'approval-token',
  email: 'alex@example.com',
};

describe('SetPasswordStep', () => {
  it('retries a saved password without collecting or resending the password', async () => {
    const action = vi.fn<OnboardingActions['signUp']>().mockResolvedValue({});
    const onComplete = vi.fn();
    const { container } = render(
      <SetPasswordStep
        applicant={{ ...applicant, passwordSet: true }}
        action={action}
        onComplete={onComplete}
      />
    );
    expect(
      screen.getByRole('heading', { name: 'Your password is saved' })
    ).toBeVisible();
    expect(container.querySelectorAll('input')).toHaveLength(0);
    fireEvent.click(screen.getByRole('button', { name: 'Continue' }));
    await waitFor(() => expect(onComplete).toHaveBeenCalledOnce());
    expect(Object.fromEntries(action.mock.calls[0][1])).toEqual({
      applicationId: '42',
      token: 'approval-token',
    });
  });

  it('collects only password fields and prevents invalid or mismatched submission', async () => {
    const action = vi.fn<OnboardingActions['signUp']>();
    const { container } = render(
      <SetPasswordStep
        applicant={applicant}
        action={action}
        onComplete={vi.fn()}
      />
    );
    expect(container.querySelectorAll('input')).toHaveLength(2);
    expect(screen.getByRole('button', { name: 'Continue' })).toBeDisabled();
    fireEvent.change(screen.getByLabelText('Create a Password'), {
      target: { value: 'Strong1!' },
    });
    fireEvent.change(screen.getByLabelText('Confirm Password'), {
      target: { value: 'Different1!' },
    });
    fireEvent.submit(container.querySelector('form')!);
    await waitFor(() => expect(action).not.toHaveBeenCalled());
    expect(screen.getByRole('button', { name: 'Continue' })).toBeDisabled();
  });

  it('submits the token and passwords without trusting client profile fields', async () => {
    const action = vi.fn<OnboardingActions['signUp']>().mockResolvedValue({});
    const onComplete = vi.fn();
    render(
      <SetPasswordStep
        applicant={applicant}
        action={action}
        onComplete={onComplete}
      />
    );
    fireEvent.change(screen.getByLabelText('Create a Password'), {
      target: { value: 'Strong1!' },
    });
    fireEvent.change(screen.getByLabelText('Confirm Password'), {
      target: { value: 'Strong1!' },
    });
    await waitFor(() =>
      expect(screen.getByRole('button', { name: 'Continue' })).toBeEnabled()
    );
    fireEvent.click(screen.getByRole('button', { name: 'Continue' }));
    await waitFor(() => expect(onComplete).toHaveBeenCalledOnce());
    const formData = action.mock.calls[0][1];
    expect(Object.fromEntries(formData)).toEqual({
      applicationId: '42',
      token: 'approval-token',
      password: 'Strong1!',
      confirmPassword: 'Strong1!',
    });
  });

  it('disables repeat submissions while saving and retains recoverable server errors', async () => {
    let fail: (reason: Error) => void = () => {};
    const action = vi.fn<OnboardingActions['signUp']>(
      () =>
        new Promise((_resolve, reject) => {
          fail = reject;
        })
    );
    const onComplete = vi.fn();
    render(
      <SetPasswordStep
        applicant={applicant}
        action={action}
        onComplete={onComplete}
      />
    );
    fireEvent.change(screen.getByLabelText('Create a Password'), {
      target: { value: 'Strong1!' },
    });
    fireEvent.change(screen.getByLabelText('Confirm Password'), {
      target: { value: 'Strong1!' },
    });
    await waitFor(() =>
      expect(screen.getByRole('button', { name: 'Continue' })).toBeEnabled()
    );
    fireEvent.click(screen.getByRole('button', { name: 'Continue' }));
    await waitFor(() =>
      expect(screen.getByRole('button', { name: 'Saving…' })).toBeDisabled()
    );
    fail(new Error('Unable to save your password'));
    expect(await screen.findByRole('alert')).toHaveTextContent(
      'Unable to save your password'
    );
    expect(onComplete).not.toHaveBeenCalled();
  });
});
