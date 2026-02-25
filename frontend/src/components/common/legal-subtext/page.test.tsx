// Copyright © Todd Agriscience, Inc. All rights reserved.

import { renderWithNextIntl, screen } from '@/test/test-utils';
import { describe, expect, it } from 'vitest';
import { LegalSubtext } from './page';

describe('LegalSubtext', () => {
  it('renders without crashing', () => {
    renderWithNextIntl(<LegalSubtext />);
    const legalParagraph = screen.getByText(
      /By continuing, you agree to the/i,
      { selector: 'p' }
    );
    expect(legalParagraph).toHaveTextContent(
      'By continuing, you agree to the Todd Account Agreement and Privacy Policy.'
    );
  });

  it('renders the account agreement link', () => {
    renderWithNextIntl(<LegalSubtext />);
    expect(
      screen.getByRole('link', { name: 'Todd Account Agreement' })
    ).toBeInTheDocument();
  });

  it('renders the privacy policy link', () => {
    renderWithNextIntl(<LegalSubtext />);
    expect(
      screen.getByRole('link', { name: 'Privacy Policy' })
    ).toBeInTheDocument();
  });

  it('renders the terms of service link', () => {
    renderWithNextIntl(<LegalSubtext />);
    expect(
      screen.getByRole('link', { name: 'Terms of Service' })
    ).toBeInTheDocument();
  });
});
