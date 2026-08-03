// Copyright © Todd Agriscience, Inc. All rights reserved.

import type { ManagementZoneSelect } from '@/lib/types/db';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { updateManagementZone } from './actions';
import ManagementZoneForm from './management-zone-form';

// jsdom has no ResizeObserver, which Radix's popover measures its trigger with.
globalThis.ResizeObserver ??= class {
  observe() {}
  unobserve() {}
  disconnect() {}
};

// Stub the server actions so nothing reaches the db module.
vi.mock('./actions', () => ({
  updateManagementZone: vi.fn().mockResolvedValue({}),
  deleteManagementZone: vi.fn().mockResolvedValue({}),
  createManagementZone: vi.fn().mockResolvedValue({}),
}));

const ROTATION_TRIGGER = 'Rotation year: July 29, 2026';
const ROTATION_TRIGGER_AFTER_PICK = 'Rotation year: July 15, 2026';
const NPK_TRIGGER = 'NPK last used: Not set';

const zone: ManagementZoneSelect = {
  id: 1,
  farmId: 1,
  location: [0, 0],
  name: 'North field',
  // `date` columns come back from the database at UTC midnight.
  rotationYear: new Date('2026-07-29'),
  npk: false,
  npkLastUsed: null,
  irrigation: false,
  waterConservation: false,
  createdAt: new Date('2026-01-01T00:00:00Z'),
  updatedAt: new Date('2026-01-01T00:00:00Z'),
};

describe('ManagementZoneForm date pickers', () => {
  beforeEach(() => {
    vi.mocked(updateManagementZone).mockClear();
  });

  it('shows the stored date on the trigger and a placeholder when unset', () => {
    render(<ManagementZoneForm zone={zone} canEdit />);

    expect(
      screen.getByRole('button', { name: ROTATION_TRIGGER })
    ).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: NPK_TRIGGER })
    ).toBeInTheDocument();
  });

  it('submits the picked day at UTC midnight, matching the date column', async () => {
    const user = userEvent.setup();
    render(<ManagementZoneForm zone={zone} canEdit />);

    await user.click(screen.getByRole('button', { name: ROTATION_TRIGGER }));
    await user.click(screen.getByRole('button', { name: /july 15th, 2026/i }));

    expect(
      screen.getByRole('button', { name: ROTATION_TRIGGER_AFTER_PICK })
    ).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'Save' }));

    expect(updateManagementZone).toHaveBeenCalledTimes(1);
    const [, submitted] = vi.mocked(updateManagementZone).mock.calls[0];
    expect(submitted.rotationYear?.toISOString()).toBe(
      '2026-07-15T00:00:00.000Z'
    );
  });

  it('disables both pickers for read only accounts', () => {
    render(<ManagementZoneForm zone={zone} canEdit={false} />);

    expect(
      screen.getByRole('button', { name: ROTATION_TRIGGER })
    ).toBeDisabled();
    expect(screen.getByRole('button', { name: NPK_TRIGGER })).toBeDisabled();
  });
});
