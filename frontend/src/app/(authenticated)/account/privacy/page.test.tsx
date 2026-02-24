// Copyright © Todd Agriscience, Inc. All rights reserved.

import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import AccountPrivacyPage from './page';

describe('AccountPrivacyPage', () => {
  it('renders the requested privacy links to the right routes', () => {
    render(<AccountPrivacyPage />);

    const contactLinks = screen.getAllByRole('link', { name: '>' });
    expect(contactLinks).toHaveLength(3);
    expect(contactLinks[0]).toHaveAttribute('href', '/contact');
    expect(contactLinks[1]).toHaveAttribute('href', '/contact');
    expect(contactLinks[2]).toHaveAttribute('href', '/privacy');
  });
});
