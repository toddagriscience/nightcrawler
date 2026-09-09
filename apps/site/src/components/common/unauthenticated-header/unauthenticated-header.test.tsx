// Copyright © Todd Agriscience, Inc. All rights reserved.

import { renderWithNextIntl, screen } from '@/test/test-utils';
import { describe, expect, it } from 'vitest';
import UnauthenticatedHeader from './unauthenticated-header';

describe('UnauthenticatedHeader', () => {
  it('renders the Todd home link without a help link', () => {
    renderWithNextIntl(<UnauthenticatedHeader />);

    expect(
      screen.getByRole('link', { name: 'Todd Agriscience home page' })
    ).toBeInTheDocument();
    expect(
      screen.queryByRole('link', { name: 'Help' })
    ).not.toBeInTheDocument();
  });
});
