// Copyright © Todd Agriscience, Inc. All rights reserved.

// Tests for the support page form flow and success state.
import { renderWithNextIntl, screen, waitFor } from '@/test/test-utils';
import userEvent from '@testing-library/user-event';
import type { Mock } from 'vitest';
import { describe, expect, test, vitest } from 'vitest';
import { submitPublicInquiry } from './action';
import Support from './page';

// Tests for the support page form flow and success state.

// Mock the server action so tests stay purely client-side.
vitest.mock('./action', () => ({
  submitPublicInquiry: vitest.fn(),
}));

describe('Support page', () => {
  test('renders the support form', () => {
    renderWithNextIntl(<Support />);

    expect(
      screen.getByRole('heading', { name: 'Need Help?' })
    ).toBeInTheDocument();
    expect(screen.getByLabelText('Name')).toBeInTheDocument();
    expect(screen.getByLabelText('Email Address')).toBeInTheDocument();
    expect(screen.getByLabelText('Message')).toBeInTheDocument();
  });

  test('submits and shows success state', async () => {
    const user = userEvent.setup();
    (submitPublicInquiry as Mock).mockResolvedValue({ error: null });

    // Fill out the form and submit to trigger the success UI.
    renderWithNextIntl(<Support />);

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
