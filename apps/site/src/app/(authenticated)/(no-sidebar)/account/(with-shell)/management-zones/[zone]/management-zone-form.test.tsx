// Copyright © Todd Agriscience, Inc. All rights reserved.

import type { ManagementZoneSelect } from '@/lib/types/db';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ResizeObserver from 'resize-observer-polyfill';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { updateManagementZone } from './actions';
import ManagementZoneForm from './management-zone-form';

// jsdom has no ResizeObserver, which Radix's popover measures its trigger with.
global.ResizeObserver = ResizeObserver;

vi.mock('./actions', () => ({
  updateManagementZone: vi.fn(async () => ({})),
}));

const ROTATION_TRIGGER = 'Rotation year: July 29, 2026';
const ROTATION_TRIGGER_AFTER_PICK = 'Rotation year: July 15, 2026';
const NPK_TRIGGER = 'NPK last used: Not set';

describe('ManagementZoneForm coordinate coercion', () => {
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

  it('keeps an edited coordinate as a number', async () => {
    render(<ManagementZoneForm zone={zone} canEdit />);

    fireEvent.change(screen.getByLabelText('Latitude'), {
      target: { value: '41.5' },
    });

    const payload = await submit();

    expect(payload.location?.[0]).toBe(41.5);
  });

  it('seeds the coordinate inputs from the stored point', () => {
    render(<ManagementZoneForm zone={zone} canEdit />);

    expect(screen.getByLabelText('Latitude')).toHaveValue(12.5);
    expect(screen.getByLabelText('Longitude')).toHaveValue(-70.25);
  });

  it('leaves the stored point untouched when neither coordinate is edited', () => {
    // `defaultValues` seeds from `zone.location`; seeding a literal [0, 0]
    // silently overwrote the real point on every save.
    render(<ManagementZoneForm zone={zone} canEdit />);

    expect(screen.getByLabelText('Latitude')).toHaveValue(12.5);
    expect(screen.getByLabelText('Longitude')).toHaveValue(-70.25);
  });
});

describe('ManagementZoneForm date pickers', () => {
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

  it('sends a deselected date as null rather than an Invalid Date', async () => {
    // The native input mapped '' to `new Date('')`, which threw
    // "RangeError: Invalid time value" inside PgDate.mapToDriverValue. The
    // picker reaches the same state by clicking the selected day again, so the
    // null-clear contract still needs defending.
    const user = userEvent.setup();
    render(<ManagementZoneForm zone={zone} canEdit />);

    await user.click(screen.getByRole('button', { name: ROTATION_TRIGGER }));
    await user.click(screen.getByRole('button', { name: /july 29th, 2026/i }));

    await user.click(screen.getByRole('button', { name: 'Save' }));

    expect(updateManagementZone).toHaveBeenCalledTimes(1);
    const [, submitted] = vi.mocked(updateManagementZone).mock.calls[0];
    expect(submitted.rotationYear).toBeNull();
  });

  it('marks the open panel with data-slot so the calendar renders transparent', async () => {
    const user = userEvent.setup();
    render(<ManagementZoneForm zone={zone} canEdit />);

    await user.click(screen.getByRole('button', { name: ROTATION_TRIGGER }));

    // calendar.tsx styles itself with
    // `[[data-slot=popover-content]_&]:bg-transparent`. Without this attribute
    // on the panel the selector never matches and the calendar keeps
    // `bg-background` inside a `bg-popover` panel — a silent visual bug no
    // other assertion would catch.
    const panel = document.querySelector('[data-slot="popover-content"]');
    expect(panel).not.toBeNull();
    expect(panel).toContainElement(
      screen.getByRole('button', { name: /july 15th, 2026/i })
    );
  });

  it('does not point a label at the trigger button', async () => {
    render(<ManagementZoneForm zone={zone} canEdit />);

    // A `<label for>` cannot name a button, so the association was inert and
    // clicking the text did nothing. The trigger owns its accessible name.
    expect(document.querySelector('label[for="rotationYear"]')).toBeNull();
    expect(
      screen.getByRole('button', { name: ROTATION_TRIGGER })
    ).toBeInTheDocument();
  });

  it('disables both pickers for read only accounts', () => {
    render(<ManagementZoneForm zone={zone} canEdit={false} />);

    expect(
      screen.getByRole('button', { name: ROTATION_TRIGGER })
    ).toBeDisabled();
    expect(screen.getByRole('button', { name: NPK_TRIGGER })).toBeDisabled();
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
