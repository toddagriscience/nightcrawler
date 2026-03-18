// Copyright © Todd Agriscience, Inc. All rights reserved.

import { render, screen } from '@/test/test-utils';
import { describe, expect, test } from 'vitest';
import { NavLinks } from './nav-links';

describe('NavLinks', () => {
  test('renders contact and account links', async () => {
    render(await NavLinks());

    expect(screen.getByRole('link', { name: 'Contact' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Account' })).toBeInTheDocument();
  });
});
