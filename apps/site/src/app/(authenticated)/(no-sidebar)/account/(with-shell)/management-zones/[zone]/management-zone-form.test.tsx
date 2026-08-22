// Copyright © Todd Agriscience, Inc. All rights reserved.

import type { ManagementZoneSelect } from '@/lib/types/db';
import { render, screen } from '@testing-library/react';
import ResizeObserver from 'resize-observer-polyfill';
import { describe, expect, it, vi } from 'vitest';
import ManagementZoneForm from './management-zone-form';

global.ResizeObserver = ResizeObserver;

vi.mock('./actions', () => ({
  updateManagementZone: vi.fn(async () => ({})),
}));

describe('ManagementZoneForm back navigation', () => {
  const zone = {
    id: 1,
    farmId: 2,
    name: 'North field',
    location: [1, 2],
    npk: false,
    npkLastUsed: null,
    rotationYear: null,
    irrigation: true,
    waterConservation: false,
    createdAt: new Date('2024-01-01T00:00:00.000Z'),
    updatedAt: new Date('2024-01-01T00:00:00.000Z'),
  } as unknown as ManagementZoneSelect;

  it('renders no back link, leaving back navigation to AccountInfo', () => {
    render(<ManagementZoneForm zone={zone} canEdit />);

    expect(
      screen.queryByRole('link', { name: /back/i })
    ).not.toBeInTheDocument();
    expect(
      screen.queryByRole('link', { name: /zones/i })
    ).not.toBeInTheDocument();
  });
});
