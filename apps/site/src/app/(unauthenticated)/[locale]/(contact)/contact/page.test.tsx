// Copyright © Todd Agriscience, Inc. All rights reserved.

import { renderWithNextIntl, screen, waitFor } from '@/test/test-utils';
import userEvent from '@testing-library/user-event';
import type { Mock } from 'vitest';
import { describe, expect, test, vitest } from 'vitest';
import { submitPublicInquiry } from './actions';
import Contact from './page';

vitest.mock('./actions', () => ({
  submitPublicInquiry: vitest.fn(),
}));

describe('Contact page', () => {
  test('renders the contact form', () => {
    renderWithNextIntl(<Contact />);

    expect(
      screen.getByRole('heading', { name: 'Need Help?' })
    ).toBeInTheDocument();
    expect(screen.getByLabelText('Name')).toBeInTheDocument();
    expect(screen.getByLabelText('Email Address')).toBeInTheDocument();
    expect(screen.getByLabelText('Message')).toBeInTheDocument();
  });

  test('submits and shows success state', async () => {
    const user = userEvent.setup();
    (submitPublicInquiry as Mock).mockResolvedValue({ data: null });

    renderWithNextIntl(<Contact />);

    await user.type(screen.getByLabelText('Name'), 'Jane Doe');
    await user.type(screen.getByLabelText('Email Address'), 'jane@example.com');
    await user.type(screen.getByLabelText('Message'), 'Need help!');

    await user.click(screen.getByRole('button', { name: 'Submit' }));

    await waitFor(() => {
      expect(submitPublicInquiry).toHaveBeenCalled();
    });

    await waitFor(() => {
      expect(
        screen.getByRole('heading', { name: 'Message Sent' })
      ).toBeInTheDocument();
    });

    expect(screen.getByRole('button', { name: 'Home' })).toBeInTheDocument();
  });
});
