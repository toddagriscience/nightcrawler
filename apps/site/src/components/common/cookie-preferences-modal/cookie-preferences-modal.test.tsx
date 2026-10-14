// Copyright © Todd Agriscience, Inc. All rights reserved.

import { beforeEach, describe, expect, test, vitest } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { NextIntlClientProvider } from 'next-intl';
import userEvent from '@testing-library/user-event';
import CookiePreferencesModal from '@/components/common/cookie-preferences-modal/cookie-preferences-modal';
import enMessages from '@/messages/cookie-preferences/en.json';
import esMessages from '@/messages/cookie-preferences/es.json';
import posthog from 'posthog-js';

vitest.unmock('next-intl');
vitest.unmock('next-intl/routing');
vitest.unmock('@/i18n/config');

// Keep the real locale-aware Link; only the Next.js navigation primitives
// need stand-ins outside a running router.
vitest.mock('next/navigation', () => ({
  usePathname: vitest.fn(() => '/'),
  useRouter: vitest.fn(() => ({
    push: vitest.fn(),
    replace: vitest.fn(),
    prefetch: vitest.fn(),
  })),
  redirect: vitest.fn(),
  permanentRedirect: vitest.fn(),
}));

function renderWithNextIntl(
  ui: React.ReactElement,
  locale: 'en' | 'es' = 'en'
) {
  return render(
    <NextIntlClientProvider
      locale={locale}
      messages={locale === 'es' ? esMessages : enMessages}
      timeZone="UTC"
    >
      {ui}
    </NextIntlClientProvider>
  );
}

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
    getExplicitConsentStatusMock.mockReturnValue('denied');
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

  test.each([
    {
      locale: 'en' as const,
      trigger: 'Cookie Settings',
      toggleLabel: 'Enable Cookies',
      privacyPolicy: 'US Privacy Policy',
      privacyHref: '/privacy',
      close: 'Close',
      save: 'Confirm',
    },
    {
      locale: 'es' as const,
      trigger: 'Configuración de cookies',
      toggleLabel: 'Habilitar cookies',
      privacyPolicy: 'Política de privacidad de EE. UU.',
      privacyHref: '/es/privacy',
      close: 'Cerrar',
      save: 'Confirmar',
    },
  ])(
    'renders translated privacy controls in $locale',
    async ({
      locale,
      trigger,
      toggleLabel,
      privacyPolicy,
      privacyHref,
      close,
      save,
    }) => {
      const user = userEvent.setup();
      renderWithNextIntl(<CookiePreferencesModal />, locale);

      await user.click(screen.getByRole('button', { name: trigger }));

      expect(
        screen.getByRole('switch', { name: toggleLabel })
      ).toBeInTheDocument();
      expect(screen.getByRole('link', { name: privacyPolicy })).toHaveAttribute(
        'href',
        privacyHref
      );

      expect(screen.getByRole('button', { name: save })).toBeInTheDocument();
      await user.click(screen.getByRole('button', { name: close }));
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    }
  );

  test('clicking the associated label enables capturing and turns the switch on', async () => {
    const user = userEvent.setup();
    renderWithNextIntl(<CookiePreferencesModal />, 'es');

    await user.click(
      screen.getByRole('button', { name: 'Configuración de cookies' })
    );
    expect(
      screen.getByRole('switch', { name: 'Habilitar cookies' })
    ).not.toBeChecked();

    await user.click(screen.getByText('Habilitar cookies'));

    expect(
      screen.getByRole('switch', { name: 'Habilitar cookies' })
    ).toBeChecked();
    expect(optInCapturingMock).toHaveBeenCalledTimes(1);
    expect(optOutCapturingMock).not.toHaveBeenCalled();
  });

  test('uses distinct label targets when multiple modal instances are mounted', async () => {
    const user = userEvent.setup();
    renderWithNextIntl(
      <>
        <CookiePreferencesModal trigger="First settings" />
        <CookiePreferencesModal trigger="Second settings" />
      </>
    );

    await user.click(screen.getByRole('button', { name: 'First settings' }));
    const firstId = screen.getByRole('switch', { name: 'Enable Cookies' }).id;
    expect(screen.getByText('Enable Cookies')).toHaveAttribute('for', firstId);
    await user.click(screen.getByRole('button', { name: 'Close' }));
    await user.click(screen.getByRole('button', { name: 'Second settings' }));
    const secondId = screen.getByRole('switch', { name: 'Enable Cookies' }).id;

    expect(firstId).not.toBe('');
    expect(secondId).not.toBe(firstId);
    expect(screen.getByText('Enable Cookies')).toHaveAttribute('for', secondId);
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

  test('displays switch with correct initial state when cookies are disabled', async () => {
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

  test('confirms and closes after enabling cookies', async () => {
    const user = userEvent.setup();

    renderWithNextIntl(<CookiePreferencesModal />);

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

    // Enabling the switch applies the preference immediately.
    const uiSwitch = screen.getByRole('switch');
    await user.click(uiSwitch);
    expect(uiSwitch).toBeChecked();
    expect(optInCapturingMock).toHaveBeenCalledTimes(1);

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
  test('disables capturing when enabled cookies are switched off', async () => {
    const user = userEvent.setup();
    getExplicitConsentStatusMock.mockReturnValue('granted');
    renderWithNextIntl(<CookiePreferencesModal />);

    const triggerButton = screen.getByRole('button', {
      name: /Cookie Settings/i,
    });
    await user.click(triggerButton);

    await waitFor(() => {
      expect(screen.getByRole('switch')).toBeInTheDocument();
    });

    const uiSwitch = screen.getByRole('switch');
    expect(uiSwitch).toBeChecked();
    await user.click(uiSwitch);
    expect(uiSwitch).not.toBeChecked();
    expect(optOutCapturingMock).toHaveBeenCalledTimes(1);
    expect(optInCapturingMock).not.toHaveBeenCalled();

    await user.click(screen.getByRole('button', { name: /confirm/i }));

    await waitFor(() => {
      // Modal should be closed (check that dialog is not in document)
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    });
  });
});
