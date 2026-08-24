// Copyright © Todd Agriscience, Inc. All rights reserved.

import type { ManagementZoneSelect } from '@/lib/types/db';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import ResizeObserver from 'resize-observer-polyfill';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { updateManagementZone } from './actions';
import ManagementZoneForm from './management-zone-form';

global.ResizeObserver = ResizeObserver;

vi.mock('./actions', () => ({
  updateManagementZone: vi.fn(async () => ({})),
}));

describe('ManagementZoneForm date and coordinate coercion', () => {
  const zone = {
    id: 7,
    farmId: 3,
    name: 'North field',
    location: [12.5, -70.25],
    rotationYear: new Date('2024-03-04T00:00:00.000Z'),
    npk: true,
    npkLastUsed: new Date('2024-05-06T00:00:00.000Z'),
    irrigation: true,
    waterConservation: false,
    createdAt: new Date('2024-01-01T00:00:00.000Z'),
    updatedAt: new Date('2024-01-01T00:00:00.000Z'),
  } as unknown as ManagementZoneSelect;

  /** Submits the form and resolves with the payload the action received. */
  async function submit() {
    fireEvent.click(screen.getByRole('button', { name: 'Save' }));
    await waitFor(() => expect(updateManagementZone).toHaveBeenCalledTimes(1));
    return vi.mocked(updateManagementZone).mock.calls[0][1];
  }

  beforeEach(() => {
    vi.mocked(updateManagementZone).mockClear();
  });

  it('sends an emptied coordinate as undefined rather than NaN', async () => {
    // react-hook-form's built-in valueAsNumber maps '' to NaN, which
    // PgPointTuple would render as the literal "(NaN,NaN)" and Postgres would
    // happily store as float8 NaN.
    render(<ManagementZoneForm zone={zone} canEdit />);

    fireEvent.change(screen.getByLabelText('Latitude'), {
      target: { value: '' },
    });

    const payload = await submit();

    expect(payload.location?.[0]).toBeUndefined();
    expect(Number.isNaN(payload.location?.[0])).toBe(false);
  });

  it('sends an emptied date as null rather than an Invalid Date', async () => {
    // valueAsDate maps '' to new Date(''), which throws
    // "RangeError: Invalid time value" inside PgDate.mapToDriverValue.
    render(<ManagementZoneForm zone={zone} canEdit />);

    fireEvent.change(screen.getByLabelText('Rotation year'), {
      target: { value: '' },
    });

    const payload = await submit();

    expect(payload.rotationYear).toBeNull();
  });

  it('keeps edited coordinates and dates as numbers and dates', async () => {
    render(<ManagementZoneForm zone={zone} canEdit />);

    fireEvent.change(screen.getByLabelText('Latitude'), {
      target: { value: '41.5' },
    });
    fireEvent.change(screen.getByLabelText('NPK last used'), {
      target: { value: '2025-02-03' },
    });

    const payload = await submit();

    expect(payload.location?.[0]).toBe(41.5);
    expect(payload.npkLastUsed).toEqual(new Date('2025-02-03'));
  });

  it('seeds the coordinate inputs from the stored point', () => {
    render(<ManagementZoneForm zone={zone} canEdit />);

    expect(screen.getByLabelText('Latitude')).toHaveValue(12.5);
    expect(screen.getByLabelText('Longitude')).toHaveValue(-70.25);
  });
});

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
