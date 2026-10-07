// Copyright © Todd Agriscience, Inc. All rights reserved.

import enMessages from '@/messages/forms/en.json';
import esMessages from '@/messages/forms/es.json';
import { render, screen, waitFor } from '@testing-library/react';
import { NextIntlClientProvider } from 'next-intl';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { FormSuccess } from './form-success';

vi.mock('next-intl', async (importActual) =>
  importActual<typeof import('next-intl')>()
);

describe('FormSuccess', () => {
  beforeEach(() => {
    vi.spyOn(window, 'scrollTo').mockImplementation(() => {});
  });

  afterEach(() => vi.restoreAllMocks());

  it.each([
    ['en', enMessages],
    ['es', esMessages],
  ] as const)('localizes seeded CMS copy in %s', async (locale, messages) => {
    render(
      <NextIntlClientProvider locale={locale} messages={messages}>
        <FormSuccess
          title="Request received"
          message="Thank you. Our team will review your request and follow up by email."
        />
      </NextIntlClientProvider>
    );

    const heading = screen.getByRole('heading', {
      level: 1,
      name: messages.formsPage.defaultSuccessTitle,
    });
    expect(
      screen.getByText(messages.formsPage.defaultSuccessMessage)
    ).toBeInTheDocument();
    expect(
      screen.getByRole('link', { name: messages.formsPage.successResearchLink })
    ).toHaveAttribute('href', '/research');
    await waitFor(() => expect(heading).toHaveFocus());
    expect(window.scrollTo).toHaveBeenCalledWith({
      top: 0,
      behavior: 'instant',
    });
  });

  it('uses the design defaults when CMS confirmation copy is missing', () => {
    render(
      <NextIntlClientProvider locale="en" messages={enMessages}>
        <FormSuccess />
      </NextIntlClientProvider>
    );

    expect(
      screen.getByRole('heading', { name: 'Submission successful' })
    ).toBeInTheDocument();
    expect(
      screen.getByText(enMessages.formsPage.defaultSuccessMessage)
    ).toBeInTheDocument();
  });

  it('preserves custom CMS confirmation copy', () => {
    render(
      <NextIntlClientProvider locale="en" messages={enMessages}>
        <FormSuccess title="Application received" message="Watch your inbox." />
      </NextIntlClientProvider>
    );

    expect(
      screen.getByRole('heading', { name: 'Application received' })
    ).toBeInTheDocument();
    expect(screen.getByText('Watch your inbox.')).toBeInTheDocument();
  });
});
