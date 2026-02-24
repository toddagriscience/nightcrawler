// Copyright © Todd Agriscience, Inc. All rights reserved.

import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import AccountManagementPage from './page';

vi.mock('../../db', () => ({
  getAccountManagementData: vi.fn(async () => ({
    sectionTitle: 'Management zone 1',
    nickname: 'North Field',
  })),
}));

describe('AccountManagementPage', () => {
  it('renders management information from account data', async () => {
    render(await AccountManagementPage());

    expect(screen.getByText('Management zone 1')).toBeInTheDocument();
    expect(screen.getByText('North Field')).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: 'Manage Management Zone' })
    ).toBeInTheDocument();
  });
});
