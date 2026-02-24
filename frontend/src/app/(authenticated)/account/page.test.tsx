// Copyright © Todd Agriscience, Inc. All rights reserved.

import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import AccountPage from './page';

vi.mock('./data/account-data', () => ({
  getAccountFarmData: vi.fn(async () => ({
    nickname: 'Mock Farm',
    legalName: 'Mock Farm LLC',
    physicalLocation: '10.111,-20.222 Mock County',
    mailingAddress: '100 Main St CA 90210 USA',
    clientSince: 'January 5, 2024',
  })),
}));

describe('AccountPage', () => {
  it('renders farm information from account data', async () => {
    render(await AccountPage());

    expect(screen.getByText('Mock Farm')).toBeInTheDocument();
    expect(screen.getByText('Mock Farm LLC')).toBeInTheDocument();
    expect(screen.getByText('10.111,-20.222 Mock County')).toBeInTheDocument();
    expect(screen.getByText('100 Main St CA 90210 USA')).toBeInTheDocument();
    expect(screen.getByText('January 5, 2024')).toBeInTheDocument();
  });
});
