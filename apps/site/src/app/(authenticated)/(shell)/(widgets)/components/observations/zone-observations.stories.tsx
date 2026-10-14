// Copyright © Todd Agriscience, Inc. All rights reserved.

import type { Meta, StoryObj } from '@storybook/react-vite';
import type { ZoneObservation } from './types';
import { ZoneObservations } from './zone-observations';

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

/**
 * Empty and filled states for notes on a management zone.
 */
const meta = {
  title: 'Authenticated/Zone/ZoneObservations',
  component: ZoneObservations,
  args: {
    zoneId: 1,
    zoneName: 'North Block',
    observations: [],
  },
} satisfies Meta<typeof ZoneObservations>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Dashed control shown before any notes exist. */
export const Empty: Story = {};

/** Saved notes with the underlined add control. */
export const Filled: Story = {
  args: {
    observations,
  },
};
