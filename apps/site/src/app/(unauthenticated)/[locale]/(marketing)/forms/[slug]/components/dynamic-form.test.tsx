// Copyright © Todd Agriscience, Inc. All rights reserved.

import type { SanityForm } from '@/lib/sanity/form-types';
import { renderWithNextIntl, screen } from '@/test/test-utils';
import { waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { submitFormSubmission } from '../actions';
import { DynamicForm } from './dynamic-form';

vi.mock('../actions', () => ({ submitFormSubmission: vi.fn() }));

/** Minimal published form used to assert header copy. */
const form = {
  _id: 'contact-form',
  title: 'CMS title',
  slug: { current: 'contact' },
  description: 'CMS description body',
  workflowType: 'generic',
  sections: [],
} satisfies SanityForm;

describe('DynamicForm', () => {
  beforeEach(() => {
    vi.mocked(submitFormSubmission).mockReset();
    vi.spyOn(window, 'scrollTo').mockImplementation(() => {});
  });

  afterEach(() => vi.restoreAllMocks());

  it('uses title and subtitle overrides in PageHeader', () => {
    renderWithNextIntl(
      <DynamicForm
        form={form}
        title="Contact our advisory team"
        subtitle="Get started with Todd Iris"
      />
    );

    expect(
      screen.getByRole('heading', { name: 'Contact our advisory team' })
    ).toBeInTheDocument();
    expect(screen.getByText('Get started with Todd Iris')).toBeInTheDocument();
    expect(screen.queryByText('CMS description body')).not.toBeInTheDocument();
  });

  it('renders the CMS title and description when no overrides are passed', () => {
    renderWithNextIntl(<DynamicForm form={form} />);

    expect(
      screen.getByRole('heading', { name: 'CMS title' })
    ).toBeInTheDocument();
    expect(screen.getByText('CMS description body')).toBeInTheDocument();
  });

  it.each(['contact', 'iris-access'])(
    'submits %s once and replaces the form with the confirmation',
    async (slug) => {
      vi.mocked(submitFormSubmission).mockResolvedValue({ data: { id: 1 } });
      const user = userEvent.setup();
      renderWithNextIntl(
        <DynamicForm
          form={{
            ...form,
            slug: { current: slug },
            successTitle: 'Request received',
            successMessage:
              'Thank you. Our team will review your request and follow up by email.',
            fields: [
              { name: 'email', label: 'Email', type: 'email', required: true },
            ],
          }}
        />
      );

      await user.type(
        screen.getByRole('textbox', { name: /^Email/ }),
        'a@b.com'
      );
      const submit = screen.getByRole('button', { name: 'Submit request' });
      await waitFor(() => expect(submit).toBeEnabled());
      await user.click(submit);

      expect(
        await screen.findByRole('heading', { name: 'Submission successful' })
      ).toBeInTheDocument();
      expect(submitFormSubmission).toHaveBeenCalledTimes(1);
      expect(submitFormSubmission).toHaveBeenCalledWith({
        formSlug: slug,
        answers: expect.objectContaining({ email: 'a@b.com' }),
        sourceArticleSlug: undefined,
      });
      expect(screen.queryByRole('textbox')).not.toBeInTheDocument();
      expect(
        screen.getByRole('link', { name: 'View our research' })
      ).toHaveAttribute('href', '/research');
    }
  );

  it('keeps the form available when submission fails', async () => {
    vi.mocked(submitFormSubmission).mockRejectedValue(new Error('Try again.'));
    const user = userEvent.setup();
    renderWithNextIntl(<DynamicForm form={form} />);
    const submit = screen.getByRole('button', { name: 'Submit request' });
    await waitFor(() => expect(submit).toBeEnabled());
    await user.click(submit);

    expect(await screen.findByText('Try again.')).toBeInTheDocument();
    expect(submitFormSubmission).toHaveBeenCalledTimes(1);
    expect(
      screen.queryByRole('link', { name: 'View our research' })
    ).not.toBeInTheDocument();
    expect(submit).toBeEnabled();
  });
});
