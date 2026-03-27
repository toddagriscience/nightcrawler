// Copyright © Todd Agriscience, Inc. All rights reserved.

import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import AccountPage from './page';

vi.mock('../db', () => ({
  getAccountFarmData: vi.fn(async () => ({
    farm: {
      informalName: 'Mock Farm',
      businessName: 'Mock Farm LLC',
      createdAt: new Date('January 5, 2024'),
    },
    location: { address1: '100 Main St', state: 'VA' },
  })),
}));

describe('AccountPage', () => {
  it('renders farm information from account data', async () => {
    render(await AccountPage());

    expect(screen.getByText('Mock Farm')).toBeInTheDocument();
    expect(screen.getByText('Mock Farm LLC')).toBeInTheDocument();
    expect(screen.getByText('100 Main St, VA')).toBeInTheDocument();
    expect(screen.getByText('1/5/2024')).toBeInTheDocument();
  });
});
