// Copyright © Todd Agriscience, Inc. All rights reserved.

import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import AccountUsersPage from './page';

vi.mock('../../db', () => ({
  getAccountUsersData: vi.fn(async () => ({
    principalOperator: {
      name: 'Alex Owner',
      email: 'alex@example.com',
      phone: '+1 (222) 111-3333',
      emailVerified: true,
      phoneVerified: false,
    },
    owner: {
      name: 'Jamie Admin',
      email: 'jamie@example.com',
      phone: '+1 (222) 444-5555',
      emailVerified: true,
      phoneVerified: true,
    },
  })),
}));

describe('AccountUsersPage', () => {
  it('renders user rows from account data', async () => {
    render(await AccountUsersPage());

    expect(screen.getByText('Alex Owner')).toBeInTheDocument();
    expect(screen.getByText('alex@example.com')).toBeInTheDocument();
    expect(screen.getByText('Jamie Admin')).toBeInTheDocument();
    expect(screen.getByText('jamie@example.com')).toBeInTheDocument();
    expect(screen.getAllByText('Verified').length).toBeGreaterThan(0);
    expect(screen.getByText('Unverified')).toBeInTheDocument();
  });
});
