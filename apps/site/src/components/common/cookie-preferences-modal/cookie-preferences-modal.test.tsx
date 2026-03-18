// Copyright © Todd Agriscience, Inc. All rights reserved.

import { beforeEach, describe, expect, test, vitest } from 'vitest';
import { renderWithNextIntl, screen, waitFor } from '@/test/test-utils';
import userEvent from '@testing-library/user-event';
import CookiePreferencesModal from './cookie-preferences-modal';
import posthog from 'posthog-js';

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

const getExplicitConsentStatusMock = vitest.spyOn(
  posthog,
  'get_explicit_consent_status'
);
const optInCapturingMock = vitest.spyOn(posthog, 'opt_in_capturing');
const optOutCapturingMock = vitest.spyOn(posthog, 'opt_out_capturing');

describe('CookiePreferencesModal', () => {
  beforeEach(() => {
    localStorage.clear();
    vitest.clearAllMocks();
  });

  test('renders default trigger button', () => {
    renderWithNextIntl(<CookiePreferencesModal />);

    expect(
      screen.getByRole('button', { name: /Cookie Settings/i })
    ).toBeInTheDocument();
  });

  test('opens modal when trigger button is clicked', async () => {
    const user = userEvent.setup();
    renderWithNextIntl(<CookiePreferencesModal />);

    const triggerButton = screen.getByRole('button');
    await user.click(triggerButton);

    await waitFor(() => {
      expect(
        screen.getByRole('heading', { name: /your privacy choices/i })
      ).toBeInTheDocument();
      expect(screen.getByText(/Todd uses non-essential/i)).toBeInTheDocument();
    });
  });

  test('displays switch with correct initial state when cookies are enabled', async () => {
    getExplicitConsentStatusMock.mockImplementation(() => 'granted');
    const user = userEvent.setup();

    renderWithNextIntl(<CookiePreferencesModal />);

    const triggerButton = screen.getByRole('button', {
      name: /Cookie Settings/i,
    });
    await user.click(triggerButton);

    await waitFor(() => {
      const uiSwitch = screen.getByRole('switch');
      expect(uiSwitch).toBeChecked();
    });
  });

  test('displays checkbox with correct initial state when cookies are disabled', async () => {
    const user = userEvent.setup();
    getExplicitConsentStatusMock.mockImplementation(() => 'denied');

    renderWithNextIntl(<CookiePreferencesModal />);

    const triggerButton = screen.getByRole('button', {
      name: /Cookie Settings/i,
    });
    await user.click(triggerButton);

    await waitFor(() => {
      const uiSwitch = screen.getByRole('switch');
      expect(uiSwitch).not.toBeChecked();
    });
  });

  test('saves preferences when save button is clicked', async () => {
    const user = userEvent.setup();

    renderWithNextIntl(<CookiePreferencesModal />);
    getExplicitConsentStatusMock.mockReturnValue('denied');

    // Wait for component to mount and initialize
    await waitFor(() => {
      expect(
        screen.getByRole('button', { name: /Cookie Settings/i })
      ).toBeInTheDocument();
    });

    // Clear PostHog mocks after initial mount
    vitest.clearAllMocks();

    const triggerButton = screen.getByRole('button', {
      name: /Cookie Settings/i,
    });
    await user.click(triggerButton);

    await waitFor(() => {
      expect(screen.getByRole('switch')).toBeInTheDocument();
    });

    // Toggle switch to disabled
    const uiSwitch = screen.getByRole('switch');
    await user.click(uiSwitch);

    // Click save button
    const saveButton = screen.getByRole('button', {
      name: /confirm/i,
    });
    await user.click(saveButton);

    await waitFor(() => {
      expect(optInCapturingMock).toHaveBeenCalled();
      expect(optOutCapturingMock).not.toHaveBeenCalled();
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    });
  });
  test('cancels and closes modal when cancel button is clicked', async () => {
    const user = userEvent.setup();
    renderWithNextIntl(<CookiePreferencesModal />);

    const triggerButton = screen.getByRole('button', {
      name: /Cookie Settings/i,
    });
    await user.click(triggerButton);

    await waitFor(() => {
      expect(screen.getByRole('switch')).toBeInTheDocument();
    });

    // Toggle checkbox
    const checkbox = screen.getByRole('switch');
    await user.click(checkbox);

    const cancelButton = screen.getByRole('button', { name: /confirm/i });
    await user.click(cancelButton);

    await waitFor(() => {
      // Modal should be closed (check that dialog is not in document)
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    });
  });
});
