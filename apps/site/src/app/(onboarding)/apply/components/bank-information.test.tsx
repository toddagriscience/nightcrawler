// Copyright © Todd Agriscience, Inc. All rights reserved.

import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import type { ReactNode } from 'react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import BankInformation from '@/app/(onboarding)/apply/components/bank-information';
import { ApplicationContext } from '@/app/(onboarding)/apply/components/onboarding-context';
import { ONBOARDING_CONTEXT } from '@/app/(onboarding)/apply/components/onboarding-fixtures';
import type { OnboardingContextValue } from '@/app/(onboarding)/apply/types';

const { mockConfirmSetup, mockLoadStripe } = vi.hoisted(() => ({
  mockConfirmSetup: vi.fn(),
  mockLoadStripe: vi.fn(() => Promise.resolve(null)),
}));
vi.mock('@/lib/stripe/public-client', () => ({
  getStripeJsClient: mockLoadStripe,
}));
vi.mock('@stripe/react-stripe-js', () => ({
  Elements: ({ children }: { children: ReactNode }) => <>{children}</>,
  PaymentElement: () => <div data-testid="stripe-payment-element" />,
  useStripe: () => ({ confirmSetup: mockConfirmSetup }),
  useElements: () => ({}),
}));

const createSetup = vi.fn(ONBOARDING_CONTEXT.actions.createAchSetupIntent);
const recordSetup = vi.fn(ONBOARDING_CONTEXT.actions.recordAchSetupComplete);
const bankSaved = vi.fn();
const continuePayment = vi.fn(async () => {});
const backToTeam = vi.fn(async () => {});

function renderWithContext(overrides: Partial<OnboardingContextValue> = {}) {
  return render(
    <ApplicationContext.Provider
      value={{
        ...ONBOARDING_CONTEXT,
        actions: {
          ...ONBOARDING_CONTEXT.actions,
          createAchSetupIntent: createSetup,
          recordAchSetupComplete: recordSetup,
        },
        onBankSetupComplete: bankSaved,
        completePaymentStep: continuePayment,
        goBackToTeam: backToTeam,
        ...overrides,
      }}
    >
      <BankInformation />
    </ApplicationContext.Provider>
  );
}

async function openSetupForm(user: ReturnType<typeof userEvent.setup>) {
  renderWithContext();
  await user.click(
    screen.getByRole('button', { name: 'Add Bank Information' })
  );
  await screen.findByTestId('stripe-payment-element');
}

describe('BankInformation', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    createSetup.mockImplementation(
      ONBOARDING_CONTEXT.actions.createAchSetupIntent
    );
    recordSetup.mockImplementation(
      ONBOARDING_CONTEXT.actions.recordAchSetupComplete
    );
    continuePayment.mockResolvedValue(undefined);
    backToTeam.mockResolvedValue(undefined);
    mockConfirmSetup.mockResolvedValue({
      setupIntent: { id: 'seti-confirmed' },
    });
  });

  it('explains bank setup without loading Stripe until requested', () => {
    renderWithContext();
    expect(
      screen.getByRole('heading', { name: 'Bank Information' })
    ).toBeInTheDocument();
    expect(
      screen.getByText(/your account will remain free/i)
    ).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'contact us' })).toHaveAttribute(
      'href',
      '/contact'
    );
    expect(mockLoadStripe).not.toHaveBeenCalled();
    expect(screen.getByRole('button', { name: 'Continue' })).toBeDisabled();
  });

  it('allows going back before bank details have been saved', async () => {
    const user = userEvent.setup();
    renderWithContext();
    await user.click(
      screen.getByRole('button', { name: 'Back to Add people' })
    );
    expect(backToTeam).toHaveBeenCalledOnce();
    expect(createSetup).not.toHaveBeenCalled();
  });

  it('allows going back after bank setup until Continue is clicked', async () => {
    const user = userEvent.setup();
    renderWithContext({ hasBankSetup: true });
    expect(screen.getByRole('status')).toHaveTextContent(
      'Bank information on file'
    );
    await user.click(
      screen.getByRole('button', { name: 'Back to Add people' })
    );
    expect(backToTeam).toHaveBeenCalledOnce();
    expect(continuePayment).not.toHaveBeenCalled();
  });

  it('persists payment Continue only when the user explicitly clicks it', async () => {
    const user = userEvent.setup();
    renderWithContext({ hasBankSetup: true });
    expect(continuePayment).not.toHaveBeenCalled();
    await user.click(screen.getByRole('button', { name: 'Continue' }));
    expect(continuePayment).toHaveBeenCalledOnce();
  });

  it('removes navigation after payment has been continued', () => {
    renderWithContext({ hasBankSetup: true, paymentContinued: true });
    expect(
      screen.queryByRole('button', { name: 'Back to Add people' })
    ).not.toBeInTheDocument();
    expect(
      screen.queryByRole('button', { name: 'Continue' })
    ).not.toBeInTheDocument();
  });

  it('disables mutations for read-only users', () => {
    renderWithContext({ canEditFarm: false });
    expect(screen.getByText(/your account is read only/i)).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: 'Add Bank Information' })
    ).toBeDisabled();
    expect(
      screen.getByRole('button', { name: 'Back to Add people' })
    ).toBeDisabled();
  });

  it('keeps payment accessible when Continue fails', async () => {
    const user = userEvent.setup();
    continuePayment.mockRejectedValueOnce(
      new Error('Unable to save progress.')
    );
    renderWithContext({ hasBankSetup: true });
    await user.click(screen.getByRole('button', { name: 'Continue' }));
    expect(await screen.findByRole('alert')).toHaveTextContent(
      'Unable to save progress.'
    );
    expect(
      screen.getByRole('button', { name: 'Back to Add people' })
    ).toBeEnabled();
  });

  it('surfaces back-navigation persistence errors', async () => {
    const user = userEvent.setup();
    backToTeam.mockRejectedValueOnce(new Error('Please retry.'));
    renderWithContext({ hasBankSetup: true });
    await user.click(
      screen.getByRole('button', { name: 'Back to Add people' })
    );
    expect(await screen.findByRole('alert')).toHaveTextContent('Please retry.');
  });

  it('shows an error when setup cannot be started and supports retry', async () => {
    const user = userEvent.setup();
    createSetup.mockResolvedValueOnce({});
    renderWithContext();
    await user.click(
      screen.getByRole('button', { name: 'Add Bank Information' })
    );
    expect(await screen.findByRole('alert')).toHaveTextContent(
      'Unable to start bank information setup'
    );
    await user.click(
      screen.getByRole('button', { name: 'Add Bank Information' })
    );
    expect(
      await screen.findByTestId('stripe-payment-element')
    ).toBeInTheDocument();
    expect(screen.queryByRole('alert')).not.toBeInTheDocument();
    expect(mockLoadStripe).toHaveBeenCalledOnce();
  });

  it('records a successful bank setup and stays at payment until Continue', async () => {
    const user = userEvent.setup();
    await openSetupForm(user);
    await user.click(
      screen.getByRole('button', { name: 'Save Bank Information' })
    );
    await waitFor(() =>
      expect(recordSetup).toHaveBeenCalledWith('seti-confirmed')
    );
    expect(bankSaved).toHaveBeenCalledOnce();
    expect(continuePayment).not.toHaveBeenCalled();
    expect(screen.getByRole('button', { name: 'Continue' })).toBeEnabled();
    expect(
      screen.getByRole('button', { name: 'Back to Add people' })
    ).toBeEnabled();
    expect(mockConfirmSetup).toHaveBeenCalledWith(
      expect.objectContaining({
        redirect: 'if_required',
        confirmParams: { return_url: window.location.origin + '/apply' },
      })
    );
  });

  it('shows a helpful message when Stripe does not support a bank', async () => {
    const user = userEvent.setup();
    mockConfirmSetup.mockResolvedValueOnce({
      error: { message: 'Bank not supported by Financial Connections.' },
    });
    await openSetupForm(user);
    await user.click(
      screen.getByRole('button', { name: 'Save Bank Information' })
    );
    expect(await screen.findByRole('alert')).toHaveTextContent(
      "please contact us and we'll finish your application"
    );
    expect(recordSetup).not.toHaveBeenCalled();
    expect(bankSaved).not.toHaveBeenCalled();
  });

  it('handles a rejected Stripe request and enables retry', async () => {
    const user = userEvent.setup();
    mockConfirmSetup.mockRejectedValueOnce(
      new Error('Network request failed.')
    );
    await openSetupForm(user);
    await user.click(
      screen.getByRole('button', { name: 'Save Bank Information' })
    );
    expect(await screen.findByRole('alert')).toHaveTextContent(
      'Network request failed.'
    );
    expect(
      screen.getByRole('button', { name: 'Save Bank Information' })
    ).toBeEnabled();
    expect(recordSetup).not.toHaveBeenCalled();
  });

  it('does not allow Continue when server verification of bank setup fails', async () => {
    const user = userEvent.setup();
    recordSetup.mockRejectedValueOnce(
      new Error('SetupIntent does not belong to this farm.')
    );
    await openSetupForm(user);
    await user.click(
      screen.getByRole('button', { name: 'Save Bank Information' })
    );
    expect(await screen.findByRole('alert')).toHaveTextContent(
      'SetupIntent does not belong to this farm.'
    );
    expect(screen.getByRole('button', { name: 'Continue' })).toBeDisabled();
    expect(bankSaved).not.toHaveBeenCalled();
  });

  it('retries server recording without confirming an already successful bank setup again', async () => {
    const user = userEvent.setup();
    recordSetup.mockRejectedValueOnce(
      new Error('Unable to save the connected bank account.')
    );
    await openSetupForm(user);
    await user.click(
      screen.getByRole('button', { name: 'Save Bank Information' })
    );
    expect(await screen.findByRole('alert')).toHaveTextContent(
      'Unable to save the connected bank account.'
    );
    expect(
      screen.queryByTestId('stripe-payment-element')
    ).not.toBeInTheDocument();
    await user.click(
      screen.getByRole('button', { name: 'Retry bank confirmation' })
    );
    expect(await screen.findByRole('status')).toHaveTextContent(
      'Bank information on file'
    );
    expect(mockConfirmSetup).toHaveBeenCalledOnce();
    expect(recordSetup).toHaveBeenNthCalledWith(2, 'seti-confirmed');
    expect(continuePayment).not.toHaveBeenCalled();
  });

  it('blocks Back while Stripe is confirming the bank account', async () => {
    const user = userEvent.setup();
    let finish: () => void = () => {};
    mockConfirmSetup.mockImplementationOnce(
      () =>
        new Promise((resolve) => {
          finish = () => resolve({ setupIntent: { id: 'seti-confirmed' } });
        })
    );
    await openSetupForm(user);
    await user.click(
      screen.getByRole('button', { name: 'Save Bank Information' })
    );
    expect(
      await screen.findByRole('button', { name: 'Saving…' })
    ).toBeDisabled();
    expect(
      screen.getByRole('button', { name: 'Back to Add people' })
    ).toBeDisabled();
    await user.click(
      screen.getByRole('button', { name: 'Back to Add people' })
    );
    expect(backToTeam).not.toHaveBeenCalled();
    finish();
    await screen.findByRole('status');
    expect(
      screen.getByRole('button', { name: 'Back to Add people' })
    ).toBeEnabled();
  });

  it('falls back to the original SetupIntent ID for server verification', async () => {
    const user = userEvent.setup();
    mockConfirmSetup.mockResolvedValueOnce({});
    await openSetupForm(user);
    await user.click(
      screen.getByRole('button', { name: 'Save Bank Information' })
    );
    await waitFor(() =>
      expect(recordSetup).toHaveBeenCalledWith('preview-setup')
    );
  });

  it('disables duplicate confirmation while bank setup is being recorded', async () => {
    const user = userEvent.setup();
    let finish: () => void = () => {};
    recordSetup.mockImplementationOnce(
      () =>
        new Promise((resolve) => {
          finish = () => resolve({});
        })
    );
    await openSetupForm(user);
    await user.click(
      screen.getByRole('button', { name: 'Save Bank Information' })
    );
    expect(
      await screen.findByRole('button', { name: 'Saving…' })
    ).toBeDisabled();
    expect(
      screen.getByRole('button', { name: 'Back to Add people' })
    ).toBeDisabled();
    finish();
    await screen.findByRole('status');
    expect(recordSetup).toHaveBeenCalledOnce();
  });

  it('verifies a Stripe redirect return without advancing payment or reloading Stripe', async () => {
    renderWithContext({ returnedSetupIntentId: 'seti-returned' });
    expect(await screen.findByRole('status')).toHaveTextContent(
      'Bank information on file'
    );
    expect(recordSetup).toHaveBeenCalledExactlyOnceWith('seti-returned');
    expect(bankSaved).toHaveBeenCalledOnce();
    expect(createSetup).not.toHaveBeenCalled();
    expect(mockLoadStripe).not.toHaveBeenCalled();
    expect(continuePayment).not.toHaveBeenCalled();
    expect(screen.getByRole('button', { name: 'Continue' })).toBeEnabled();
  });

  it('retries failed redirect verification with the same SetupIntent', async () => {
    const user = userEvent.setup();
    recordSetup.mockRejectedValueOnce(
      new Error('Bank verification could not be saved.')
    );
    renderWithContext({ returnedSetupIntentId: 'seti-returned' });
    expect(await screen.findByRole('alert')).toHaveTextContent(
      'Bank verification could not be saved.'
    );
    expect(screen.getByRole('button', { name: 'Continue' })).toBeDisabled();
    expect(recordSetup).toHaveBeenCalledOnce();
    await user.click(
      screen.getByRole('button', { name: 'Retry bank confirmation' })
    );
    expect(await screen.findByRole('status')).toHaveTextContent(
      'Bank information on file'
    );
    expect(recordSetup).toHaveBeenNthCalledWith(2, 'seti-returned');
    expect(createSetup).not.toHaveBeenCalled();
    expect(continuePayment).not.toHaveBeenCalled();
  });

  it('allows a fresh bank setup when a returned SetupIntent cannot be completed', async () => {
    const user = userEvent.setup();
    recordSetup.mockRejectedValueOnce(
      new Error('Bank information setup is not complete (status: canceled).')
    );
    renderWithContext({ returnedSetupIntentId: 'seti-canceled' });
    await screen.findByRole('alert');
    await user.click(
      screen.getByRole('button', { name: 'Start bank setup again' })
    );
    expect(
      await screen.findByTestId('stripe-payment-element')
    ).toBeInTheDocument();
    expect(createSetup).toHaveBeenCalledOnce();
    expect(screen.queryByRole('alert')).not.toBeInTheDocument();
    await user.click(
      screen.getByRole('button', { name: 'Save Bank Information' })
    );
    expect(await screen.findByRole('status')).toHaveTextContent(
      'Bank information on file'
    );
    expect(recordSetup).toHaveBeenNthCalledWith(1, 'seti-canceled');
    expect(recordSetup).toHaveBeenNthCalledWith(2, 'seti-confirmed');
    expect(recordSetup).toHaveBeenCalledTimes(2);
    expect(continuePayment).not.toHaveBeenCalled();
  });

  it('does not re-record an already saved bank account after a Stripe return', () => {
    renderWithContext({
      returnedSetupIntentId: 'seti-returned',
      hasBankSetup: true,
    });
    expect(screen.getByRole('status')).toHaveTextContent(
      'Bank information on file'
    );
    expect(recordSetup).not.toHaveBeenCalled();
  });

  it('does not restore returned setup information for read-only users', async () => {
    renderWithContext({
      returnedSetupIntentId: 'seti-returned',
      canEditFarm: false,
    });
    expect(
      await screen.findByRole('button', { name: 'Retry bank confirmation' })
    ).toBeDisabled();
    expect(recordSetup).not.toHaveBeenCalled();
  });
});
