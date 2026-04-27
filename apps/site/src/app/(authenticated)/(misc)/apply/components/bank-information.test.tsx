// Copyright © Todd Agriscience, Inc. All rights reserved.

import type {
  FarmInfoInternalApplicationSelect,
  FarmSubscriptionSelect,
  UserSelect,
} from '@/lib/types/db';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import type { ReactNode } from 'react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import type {
  GeneralBusinessInformationUpdate,
  TabTypes,
  VerificationStatus,
} from '../types';
import { ApplicationContext } from './application-tabs';
import BankInformation from './bank-information';

/**
 * Stripe.js gets loaded as soon as this file imports BankInformation.
 * The test environment has no Stripe key, so we hand back an empty
 * promise to keep the import quiet.
 */
vi.mock('@/lib/stripe/public-client', () => ({
  getStripeJsClient: () => Promise.resolve(null),
}));

/**
 * `vi.hoisted` lets us share these mock functions with the `vi.mock`
 * factories below, since Vitest moves those factories above all imports.
 */
const {
  mockConfirmSetup,
  mockCreateAchSetupIntent,
  mockRecordAchSetupComplete,
} = vi.hoisted(() => ({
  mockConfirmSetup: vi.fn(),
  mockCreateAchSetupIntent: vi.fn(),
  mockRecordAchSetupComplete: vi.fn(),
}));

/**
 * Replace Stripe's React components with simple fakes. The real
 * `<Elements>` would try to spin up a Stripe iframe, which can't run in
 * vitest. The fake just renders its children so the inner form is still
 * reachable for our assertions.
 */
vi.mock('@stripe/react-stripe-js', () => ({
  Elements: ({ children }: { children: ReactNode }) => <>{children}</>,
  PaymentElement: () => (
    <div data-testid="stripe-payment-element">[stripe payment element]</div>
  ),
  useStripe: () => ({ confirmSetup: mockConfirmSetup }),
  useElements: () => ({}),
}));

vi.mock('../actions', () => ({
  createAchSetupIntent: (...args: unknown[]) =>
    mockCreateAchSetupIntent(...args),
  recordAchSetupComplete: (...args: unknown[]) =>
    mockRecordAchSetupComplete(...args),
}));

const mockSetCurrentTab = vi.fn<(tab: TabTypes) => void>();

const baseContextValue = {
  farmInfo: {} as GeneralBusinessInformationUpdate,
  allUsers: [] as UserSelect[],
  currentUser: {} as UserSelect,
  internalApplication: {} as FarmInfoInternalApplicationSelect,
  farmSubscription: null as FarmSubscriptionSelect | null,
  invitedUserVerificationStatus: [] as VerificationStatus[],
  setCurrentTab: mockSetCurrentTab,
  canSubmitApplication: false,
  canEditFarm: true,
};

/**
 * Renders <BankInformation /> inside ApplicationContext using the
 * standard "admin user, no bank on file yet" defaults, plus any
 * per-test overrides on top.
 */
function renderWithContext(overrides: Partial<typeof baseContextValue> = {}) {
  return render(
    <ApplicationContext.Provider value={{ ...baseContextValue, ...overrides }}>
      <BankInformation />
    </ApplicationContext.Provider>
  );
}

/** Helper for tests that need a `farmSubscription` row with a given status. */
function farmSubscriptionWithStatus(
  status: string
): FarmSubscriptionSelect | null {
  return { status } as FarmSubscriptionSelect;
}

/**
 * Renders the component, sets up a successful SetupIntent response, and
 * clicks "Add Bank Information" so the inner BankSetupForm is on screen.
 * Returns once the Stripe payment element has rendered.
 */
async function openSetupForm(
  user: ReturnType<typeof userEvent.setup>,
  overrides: Partial<typeof baseContextValue> = {}
) {
  mockCreateAchSetupIntent.mockResolvedValueOnce({
    data: {
      clientSecret: 'seti_test_secret_123',
      setupIntentId: 'seti_test_123',
    },
  });

  renderWithContext(overrides);

  await user.click(
    screen.getByRole('button', { name: /add bank information/i })
  );

  await waitFor(() => {
    expect(screen.getByTestId('stripe-payment-element')).toBeInTheDocument();
  });
}

describe('BankInformation', () => {
  /** Lets us check that BankSetupForm reloads the page after a successful save. */
  const reloadSpy = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    reloadSpy.mockClear();
    /**
     * jsdom doesn't really implement `scrollTo`. Without this stub, our
     * code triggers a noisy "Not implemented" warning whenever it scrolls.
     */
    vi.stubGlobal('scrollTo', vi.fn() as unknown as typeof window.scrollTo);
    /**
     * jsdom won't let us replace just `location.reload`, so we swap out
     * the whole `location` object. Spreading the original keeps everything
     * else (origin, href, pathname, etc.) intact for our code.
     */
    vi.stubGlobal('location', {
      ...window.location,
      reload: reloadSpy,
    });
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    vi.restoreAllMocks();
  });

  describe('intro panel', () => {
    it('renders the heading and the no-charge disclaimer', () => {
      renderWithContext();

      expect(
        screen.getByRole('heading', { name: /bank information/i })
      ).toBeInTheDocument();
      expect(
        screen.getByText(/your account will remain free/i)
      ).toBeInTheDocument();
    });

    it('explains Financial Connections and links to /contact for unsupported banks', () => {
      renderWithContext();

      expect(
        screen.getByText(/sign in to your bank in a secure pop-up/i)
      ).toBeInTheDocument();

      const contactLink = screen.getByRole('link', { name: /contact us/i });
      expect(contactLink).toHaveAttribute('href', '/contact');
    });
  });

  describe('access control', () => {
    it('shows the read-only warning for non-admins', () => {
      renderWithContext({ canEditFarm: false });

      expect(
        screen.getByText(/your account is read only/i)
      ).toBeInTheDocument();
    });

    it('disables the "Add Bank Information" button for non-admins', () => {
      renderWithContext({ canEditFarm: false });

      expect(
        screen.getByRole('button', { name: /add bank information/i })
      ).toBeDisabled();
    });

    it('does not show the read-only warning for admins', () => {
      renderWithContext({ canEditFarm: true });

      expect(
        screen.queryByText(/your account is read only/i)
      ).not.toBeInTheDocument();
    });
  });

  describe('when the farm already has bank info on file', () => {
    it('shows the success card for status `bank_setup_complete`', () => {
      renderWithContext({
        farmSubscription: farmSubscriptionWithStatus('bank_setup_complete'),
      });

      expect(screen.getByText(/bank information on file/i)).toBeInTheDocument();
      expect(
        screen.queryByRole('button', { name: /add bank information/i })
      ).not.toBeInTheDocument();
    });

    it('also accepts an `active` Stripe subscription as bank-on-file', () => {
      renderWithContext({
        farmSubscription: farmSubscriptionWithStatus('active'),
      });

      expect(screen.getByText(/bank information on file/i)).toBeInTheDocument();
    });

    it('also accepts a `trialing` Stripe subscription as bank-on-file', () => {
      renderWithContext({
        farmSubscription: farmSubscriptionWithStatus('trialing'),
      });

      expect(screen.getByText(/bank information on file/i)).toBeInTheDocument();
      expect(
        screen.queryByRole('button', { name: /add bank information/i })
      ).not.toBeInTheDocument();
    });

    it('navigates to the terms tab when "Continue to Terms" is clicked', async () => {
      const user = userEvent.setup();
      renderWithContext({
        farmSubscription: farmSubscriptionWithStatus('bank_setup_complete'),
      });

      await user.click(
        screen.getByRole('button', { name: /continue to terms/i })
      );

      expect(mockSetCurrentTab).toHaveBeenCalledWith('terms');
    });

    it('still lets a read-only viewer continue to terms when a bank is already on file', async () => {
      const user = userEvent.setup();
      renderWithContext({
        canEditFarm: false,
        farmSubscription: farmSubscriptionWithStatus('bank_setup_complete'),
      });

      // Read-only warning is still shown for context...
      expect(
        screen.getByText(/your account is read only/i)
      ).toBeInTheDocument();

      // ...but Continue to Terms is fully enabled because the data is set.
      const continueButton = screen.getByRole('button', {
        name: /continue to terms/i,
      });
      expect(continueButton).toBeEnabled();
      await user.click(continueButton);
      expect(mockSetCurrentTab).toHaveBeenCalledWith('terms');
    });
  });

  describe('starting the setup flow', () => {
    it('shows an error when the server cannot start the setup intent', async () => {
      const user = userEvent.setup();
      mockCreateAchSetupIntent.mockResolvedValueOnce({ data: undefined });

      renderWithContext();

      await user.click(
        screen.getByRole('button', { name: /add bank information/i })
      );

      await waitFor(() => {
        expect(
          screen.getByText(/unable to start bank information setup/i)
        ).toBeInTheDocument();
      });
    });

    it('renders the Stripe payment element after a successful setup intent', async () => {
      const user = userEvent.setup();
      await openSetupForm(user);

      /**
       * Our fake `<Elements>` just passes children through, so the inner
       * BankSetupForm shows up as soon as we have a client secret.
       */
      expect(
        screen.getByRole('button', { name: /save bank information/i })
      ).toBeInTheDocument();
    });

    it('shows "Preparing…" and disables the button while the setup intent is in flight', async () => {
      const user = userEvent.setup();
      let resolveCreate: (value: unknown) => void = () => {};
      mockCreateAchSetupIntent.mockReturnValueOnce(
        new Promise((resolve) => {
          resolveCreate = resolve;
        })
      );

      renderWithContext();

      const button = screen.getByRole('button', {
        name: /add bank information/i,
      });
      await user.click(button);

      // Mid-flight: button text flips to "Preparing…" and stays disabled.
      const preparing = await screen.findByRole('button', {
        name: /preparing/i,
      });
      expect(preparing).toBeDisabled();

      // Now complete the request to keep the test from leaking a pending promise.
      resolveCreate({
        data: {
          clientSecret: 'seti_test_secret_xyz',
          setupIntentId: 'seti_test_xyz',
        },
      });

      await waitFor(() => {
        expect(
          screen.getByTestId('stripe-payment-element')
        ).toBeInTheDocument();
      });
    });

    it('clears a previous init error when the user retries', async () => {
      const user = userEvent.setup();
      // 1st call fails, 2nd call succeeds.
      mockCreateAchSetupIntent.mockResolvedValueOnce({ data: undefined });
      mockCreateAchSetupIntent.mockResolvedValueOnce({
        data: {
          clientSecret: 'seti_retry_secret',
          setupIntentId: 'seti_retry',
        },
      });

      renderWithContext();

      await user.click(
        screen.getByRole('button', { name: /add bank information/i })
      );
      await screen.findByText(/unable to start bank information setup/i);

      await user.click(
        screen.getByRole('button', { name: /add bank information/i })
      );

      await waitFor(() => {
        expect(
          screen.queryByText(/unable to start bank information setup/i)
        ).not.toBeInTheDocument();
      });
      expect(screen.getByTestId('stripe-payment-element')).toBeInTheDocument();
    });
  });

  describe('submitting bank information', () => {
    it('records the SetupIntent and reloads on a successful save', async () => {
      const user = userEvent.setup();
      await openSetupForm(user);

      mockConfirmSetup.mockResolvedValueOnce({
        setupIntent: { id: 'seti_test_123' },
        error: undefined,
      });
      mockRecordAchSetupComplete.mockResolvedValueOnce({});

      await user.click(
        screen.getByRole('button', { name: /save bank information/i })
      );

      await waitFor(() => {
        expect(mockRecordAchSetupComplete).toHaveBeenCalledWith(
          'seti_test_123'
        );
      });
      expect(reloadSpy).toHaveBeenCalledTimes(1);
    });

    it('shows a friendly fallback when Stripe rejects an unsupported bank', async () => {
      const user = userEvent.setup();
      await openSetupForm(user);

      mockConfirmSetup.mockResolvedValueOnce({
        setupIntent: undefined,
        error: {
          message: 'Your bank is not supported by Financial Connections.',
        },
      });

      await user.click(
        screen.getByRole('button', { name: /save bank information/i })
      );

      await waitFor(() => {
        expect(
          screen.getByText(
            /please contact us and we'll finish your application/i
          )
        ).toBeInTheDocument();
      });
      expect(mockRecordAchSetupComplete).not.toHaveBeenCalled();
      expect(reloadSpy).not.toHaveBeenCalled();
    });

    it('shows "Saving…" while the server is recording the setup', async () => {
      const user = userEvent.setup();
      await openSetupForm(user);

      mockConfirmSetup.mockResolvedValueOnce({
        setupIntent: { id: 'seti_test_123' },
        error: undefined,
      });
      let resolveRecord: (value: unknown) => void = () => {};
      mockRecordAchSetupComplete.mockReturnValueOnce(
        new Promise((resolve) => {
          resolveRecord = resolve;
        })
      );

      await user.click(
        screen.getByRole('button', { name: /save bank information/i })
      );

      const saving = await screen.findByRole('button', { name: /saving/i });
      expect(saving).toBeDisabled();

      resolveRecord({});
      await waitFor(() => {
        expect(reloadSpy).toHaveBeenCalledTimes(1);
      });
    });

    it('passes a generic confirm error through unchanged (non-bank wording)', async () => {
      const user = userEvent.setup();
      await openSetupForm(user);

      mockConfirmSetup.mockResolvedValueOnce({
        setupIntent: undefined,
        error: { message: 'Network request failed.' },
      });

      await user.click(
        screen.getByRole('button', { name: /save bank information/i })
      );

      // `friendlyConfirmErrorMessage` only adds the "contact us" hint for
      // recognizably bank-related wording. A plain network error should
      // pass through verbatim.
      await waitFor(() => {
        expect(screen.getByText(/network request failed/i)).toBeInTheDocument();
      });
      expect(screen.queryByText(/please contact us/i)).not.toBeInTheDocument();
    });

    it('uses the generic fallback when Stripe returns no error message', async () => {
      const user = userEvent.setup();
      await openSetupForm(user);

      mockConfirmSetup.mockResolvedValueOnce({
        setupIntent: undefined,
        error: { message: undefined },
      });

      await user.click(
        screen.getByRole('button', { name: /save bank information/i })
      );

      await waitFor(() => {
        expect(
          screen.getByText(/we could not verify your bank information/i)
        ).toBeInTheDocument();
      });
    });

    it('falls back to the setupIntentId prop when Stripe omits setupIntent.id', async () => {
      const user = userEvent.setup();
      await openSetupForm(user);

      // Stripe handed back no setupIntent (e.g. redirect flow); we should
      // still record the original intent id we kicked off the flow with.
      mockConfirmSetup.mockResolvedValueOnce({
        setupIntent: undefined,
        error: undefined,
      });
      mockRecordAchSetupComplete.mockResolvedValueOnce({});

      await user.click(
        screen.getByRole('button', { name: /save bank information/i })
      );

      await waitFor(() => {
        expect(mockRecordAchSetupComplete).toHaveBeenCalledWith(
          'seti_test_123'
        );
      });
    });

    it('surfaces a server error if recordAchSetupComplete rejects', async () => {
      const user = userEvent.setup();
      await openSetupForm(user);

      mockConfirmSetup.mockResolvedValueOnce({
        setupIntent: { id: 'seti_test_123' },
        error: undefined,
      });
      mockRecordAchSetupComplete.mockRejectedValueOnce(
        new Error('SetupIntent does not belong to this farm.')
      );

      await user.click(
        screen.getByRole('button', { name: /save bank information/i })
      );

      /**
       * `formatActionResponseErrors` shows the real `Error.message` to the
       * user, so they see the specific server reason instead of a generic
       * fallback.
       */
      await waitFor(() => {
        expect(
          screen.getByText(/setupintent does not belong to this farm/i)
        ).toBeInTheDocument();
      });
      expect(reloadSpy).not.toHaveBeenCalled();
    });
  });
});
