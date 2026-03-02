// Copyright © Todd Agriscience, Inc. All rights reserved.

import { renderWithNextIntl, screen, waitFor } from '@/test/test-utils';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import PublicInquiryModal from './public-inquiry-modal';

describe('PublicInquiryModal', () => {
  it('opens the modal and shows support options', async () => {
    const user = userEvent.setup();
    renderWithNextIntl(<PublicInquiryModal />);

    // Trigger the modal the same way a user would.
    await user.click(screen.getByRole('button', { name: 'Help' }));

    // Wait for Radix dialog content to appear in the DOM.
    await waitFor(() => {
      expect(
        screen.getByRole('heading', { name: 'What can we help with?' })
      ).toBeInTheDocument();
    });

    expect(
      screen.getByRole('link', { name: 'Forgot Email' })
    ).toBeInTheDocument();
    expect(
      screen.getByRole('link', { name: 'Forgot Password' })
    ).toBeInTheDocument();
    expect(
      screen.getByRole('link', { name: 'Contact Support' })
    ).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Cancel' })).toBeInTheDocument();
  });
});
