// Copyright © Todd Agriscience, Inc. All rights reserved.

import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import type { ZoneObservation } from './types';
import { ZoneObservations } from './zone-observations';

vi.mock('./actions', () => ({
  createObservation: vi.fn(),
  updateObservation: vi.fn(),
  deleteObservation: vi.fn(),
}));

vi.mock('next/navigation', () => ({
  useRouter: () => ({ refresh: vi.fn() }),
}));

const observations: ZoneObservation[] = [
  {
    id: 1,
    body: 'Applied lime to the north corner in early March. Not sure if that will affect the soil',
    observedOn: new Date(Date.UTC(2026, 2, 20)),
  },
  {
    id: 2,
    body: 'Noticed aphids or white flys in the purple cabbage',
    observedOn: new Date(Date.UTC(2026, 3, 8)),
  },
];

describe('ZoneObservations', () => {
  it('renders the dashed empty state and opens the add dialog', async () => {
    const user = userEvent.setup();
    render(
      <ZoneObservations zoneId={1} zoneName="North Block" observations={[]} />
    );

    const add = screen.getByRole('button', {
      name: '+ Add an observation to North Block',
    });
    expect(add.className).toContain('border-dashed');
    expect(add.className).toContain('hover:text-foreground');

    await user.click(add);

    expect(
      screen.getByRole('heading', { name: 'Add an observation' })
    ).toBeInTheDocument();
    expect(screen.getByLabelText('Observation')).toBeInTheDocument();
    expect(screen.getByLabelText(/date/i)).toBeInTheDocument();
  });

  it('renders saved notes with edit and delete, and confirms delete in place', async () => {
    const user = userEvent.setup();
    render(
      <ZoneObservations
        zoneId={1}
        zoneName="North Block"
        observations={observations}
      />
    );

    expect(
      screen.getByText(
        'Applied lime to the north corner in early March. Not sure if that will affect the soil'
      )
    ).toBeInTheDocument();
    expect(screen.getByText('March 20, 2026')).toBeInTheDocument();
    expect(screen.getByText('April 8, 2026')).toBeInTheDocument();
    expect(
      screen.getByRole('button', {
        name: '+ Add an observation to North Block',
      }).className
    ).toContain('underline');
    expect(screen.queryByRole('button', { name: 'Confirm' })).toBeNull();

    await user.click(screen.getAllByRole('button', { name: 'Delete' })[0]);

    expect(screen.getByRole('button', { name: 'Confirm' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Cancel' })).toBeInTheDocument();
  });

  it('opens the edit dialog for an existing note', async () => {
    const user = userEvent.setup();
    render(
      <ZoneObservations
        zoneId={1}
        zoneName="North Block"
        observations={observations}
      />
    );

    await user.click(screen.getAllByRole('button', { name: 'Edit' })[0]);

    expect(
      screen.getByRole('heading', { name: 'Edit observation' })
    ).toBeInTheDocument();
    expect(
      screen.getByDisplayValue(
        'Applied lime to the north corner in early March. Not sure if that will affect the soil'
      )
    ).toBeInTheDocument();
  });
});
