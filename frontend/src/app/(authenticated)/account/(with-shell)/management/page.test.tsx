// Copyright © Todd Agriscience, Inc. All rights reserved.

import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import AccountManagementPage from './page';

vi.mock('../../db', () => ({
  getManagementZones: vi.fn(async () => [
    {
      id: 1,
      farmId: 2,
      location: null,
      name: 'North Field',
      rotationYear: null,
      npk: null,
      npkLastUsed: null,
      irrigation: null,
      waterConservation: null,
      contaminationRisk: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: 2,
      farmId: 2,
      location: null,
      name: 'South Field',
      rotationYear: null,
      npk: null,
      npkLastUsed: null,
      irrigation: null,
      waterConservation: null,
      contaminationRisk: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ]),
}));

describe('AccountManagementPage', () => {
  it('renders management information from account data', async () => {
    render(await AccountManagementPage());

    expect(screen.getAllByText('North Field').length).toBeGreaterThan(0);
    expect(screen.getAllByText('South Field').length).toBeGreaterThan(0);
    const profileLinks = screen.getAllByRole('link', {
      name: 'Management zone profile >',
    });
    expect(profileLinks).toHaveLength(2);
    expect(profileLinks[0]).toHaveAttribute('href', '/account/management-zones/1');
    expect(profileLinks[1]).toHaveAttribute('href', '/account/management-zones/2');
  });
});
