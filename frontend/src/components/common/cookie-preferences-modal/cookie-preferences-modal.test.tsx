// Copyright © Todd Agriscience, Inc. All rights reserved.

import { beforeEach, describe, expect, test, vitest } from 'vitest';
import { renderWithNextIntl, screen, waitFor } from '@/test/test-utils';
import userEvent from '@testing-library/user-event';
import CookiePreferencesModal from './cookie-preferences-modal';
import posthog from 'posthog-js';

vitest.mock('posthog-js', () => ({
  default: {
    opt_in_capturing: vitest.fn(),
    opt_out_capturing: vitest.fn(),
  },
}));

vitest.mock('next/image', () => ({
  default: ({
    src,
    alt,
    width,
    height,
  }: {
    src: string;
    alt: string;
    width: number;
    height: number;
  }) => (
    // ESLint complains about this for some reason
    // eslint-disable-next-line @next/next/no-img-element
    <img src={src} alt={alt} width={width} height={height} />
  ),
}));

describe('CookiePreferencesModal', () => {
  const COOKIE_PREFERENCES_KEY = 'user_cookie_consent';

  beforeEach(() => {
    localStorage.clear();
    vitest.clearAllMocks();
  });

  test('renders default trigger button', () => {
    renderWithNextIntl(<CookiePreferencesModal />);

    expect(
      screen.getByRole('button', { name: /manage your privacy choices/i })
    ).toBeInTheDocument();
  });

  test('opens modal when trigger button is clicked', async () => {
    const user = userEvent.setup();
    renderWithNextIntl(<CookiePreferencesModal />);

    const triggerButton = screen.getByRole('button', {
      name: /manage your privacy choices/i,
    });
    await user.click(triggerButton);

    await waitFor(() => {
      expect(
        screen.getByRole('heading', { name: /cookie preferences/i })
      ).toBeInTheDocument();
      expect(
        screen.getByText(/manage your cookie preferences/i)
      ).toBeInTheDocument();
    });
  });

  test('displays checkbox with correct initial state when cookies are enabled', async () => {
    const user = userEvent.setup();
    localStorage.setItem(
      COOKIE_PREFERENCES_KEY,
      JSON.stringify({ enabled: true, timestamp: Date.now() })
    );

    renderWithNextIntl(<CookiePreferencesModal />);

    const triggerButton = screen.getByRole('button', {
      name: /manage your privacy choices/i,
    });
    await user.click(triggerButton);

    await waitFor(() => {
      const checkbox = screen.getByRole('checkbox', {
        name: /enable cookies/i,
      });
      expect(checkbox).toBeChecked();
    });
  });

  test('displays checkbox with correct initial state when cookies are disabled', async () => {
    const user = userEvent.setup();
    localStorage.setItem(
      COOKIE_PREFERENCES_KEY,
      JSON.stringify({ enabled: false, timestamp: Date.now() })
    );

    renderWithNextIntl(<CookiePreferencesModal />);

    const triggerButton = screen.getByRole('button', {
      name: /manage your privacy choices/i,
    });
    await user.click(triggerButton);

    await waitFor(() => {
      const checkbox = screen.getByRole('checkbox', {
        name: /enable cookies/i,
      });
      expect(checkbox).not.toBeChecked();
    });
  });

  test('saves preferences when save button is clicked', async () => {
    const user = userEvent.setup();
    localStorage.setItem(
      COOKIE_PREFERENCES_KEY,
      JSON.stringify({ enabled: true, timestamp: Date.now() })
    );

    renderWithNextIntl(<CookiePreferencesModal />);

    // Wait for component to mount and initialize
    await waitFor(() => {
      expect(
        screen.getByRole('button', { name: /manage your privacy choices/i })
      ).toBeInTheDocument();
    });

    // Clear PostHog mocks after initial mount
    vitest.clearAllMocks();

    const triggerButton = screen.getByRole('button', {
      name: /manage your privacy choices/i,
    });
    await user.click(triggerButton);

    await waitFor(() => {
      expect(screen.getByRole('checkbox')).toBeInTheDocument();
    });

    // Toggle checkbox to disabled
    const checkbox = screen.getByRole('checkbox', { name: /enable cookies/i });
    await user.click(checkbox);

    // Click save button
    const saveButton = screen.getByRole('button', {
      name: /save preferences/i,
    });
    await user.click(saveButton);

    await waitFor(() => {
      // Check that preferences were saved to localStorage
      const saved = localStorage.getItem(COOKIE_PREFERENCES_KEY);
      expect(saved).toBeTruthy();
      const parsed = JSON.parse(saved!);
      expect(parsed.enabled).toBe(false);
      expect(parsed.timestamp).toBeDefined();

      // Check that PostHog opt_out was called (after clearing mocks)
      expect(posthog.opt_out_capturing).toHaveBeenCalled();
      expect(posthog.opt_in_capturing).not.toHaveBeenCalled();

      // Modal should be closed (check that dialog is not in document)
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    });
  });

  test('calls PostHog opt_in when enabling cookies', async () => {
    const user = userEvent.setup();
    localStorage.setItem(
      COOKIE_PREFERENCES_KEY,
      JSON.stringify({ enabled: false, timestamp: Date.now() })
    );

    renderWithNextIntl(<CookiePreferencesModal />);

    // Wait for component to mount and initialize
    await waitFor(() => {
      expect(
        screen.getByRole('button', { name: /manage your privacy choices/i })
      ).toBeInTheDocument();
    });

    // Clear PostHog mocks after initial mount
    vitest.clearAllMocks();

    const triggerButton = screen.getByRole('button', {
      name: /manage your privacy choices/i,
    });
    await user.click(triggerButton);

    await waitFor(() => {
      expect(screen.getByRole('checkbox')).toBeInTheDocument();
    });

    // Toggle checkbox to enabled
    const checkbox = screen.getByRole('checkbox', { name: /enable cookies/i });
    await user.click(checkbox);

    // Click save button
    const saveButton = screen.getByRole('button', {
      name: /save preferences/i,
    });
    await user.click(saveButton);

    await waitFor(() => {
      // Check that PostHog opt_in was called (after clearing mocks)
      expect(posthog.opt_in_capturing).toHaveBeenCalled();
      expect(posthog.opt_out_capturing).not.toHaveBeenCalled();
    });
  });

  test('cancels and closes modal when cancel button is clicked', async () => {
    const user = userEvent.setup();
    localStorage.setItem(
      COOKIE_PREFERENCES_KEY,
      JSON.stringify({ enabled: true, timestamp: Date.now() })
    );

    renderWithNextIntl(<CookiePreferencesModal />);

    const triggerButton = screen.getByRole('button', {
      name: /manage your privacy choices/i,
    });
    await user.click(triggerButton);

    await waitFor(() => {
      expect(screen.getByRole('checkbox')).toBeInTheDocument();
    });

    // Toggle checkbox
    const checkbox = screen.getByRole('checkbox', { name: /enable cookies/i });
    await user.click(checkbox);

    // Click cancel button
    const cancelButton = screen.getByRole('button', { name: /cancel/i });
    await user.click(cancelButton);

    await waitFor(() => {
      // Modal should be closed (check that dialog is not in document)
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument();

      // Preferences should not be saved (should remain enabled)
      const saved = localStorage.getItem(COOKIE_PREFERENCES_KEY);
      const parsed = JSON.parse(saved!);
      expect(parsed.enabled).toBe(true);
    });
  });
});
