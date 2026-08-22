// Copyright © Todd Agriscience, Inc. All rights reserved.

import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { RemindersList } from './reminders-list';
import type { Reminder } from './types';

// Stub children so the test exercises only the grouping logic — and so we don't
// pull in the server actions / db module through ReminderCard.
vi.mock('./reminder-card', () => ({
  ReminderCard: ({ reminder }: { reminder: Reminder }) => (
    <div data-testid="reminder-card">{reminder.title}</div>
  ),
}));
vi.mock('./reminder-edit-sheet', () => ({
  ReminderEditSheet: () => null,
}));

const DAY = 24 * 60 * 60 * 1000;

function makeReminder(overrides: Partial<Reminder>): Reminder {
  return {
    id: 1,
    type: 'planting',
    title: 'Reminder',
    body: '',
    read: false,
    createdAt: new Date(),
    href: null,
    dueDate: null,
    seasonalLabel: null,
    ...overrides,
  };
}

describe('RemindersList', () => {
  it('shows the empty state when there are no reminders', () => {
    render(<RemindersList reminders={[]} />);
    expect(screen.getByText(/all caught up/i)).toBeInTheDocument();
    expect(screen.queryByTestId('reminder-card')).not.toBeInTheDocument();
  });

  it('splits reminders into Upcoming (within 90 days) and Later', () => {
    const reminders = [
      makeReminder({
        id: 1,
        title: 'Soon',
        dueDate: new Date(Date.now() + 5 * DAY),
      }),
      makeReminder({
        id: 2,
        title: 'Far off',
        dueDate: new Date(Date.now() + 500 * DAY),
      }),
    ];

    render(<RemindersList reminders={reminders} />);

    expect(screen.getByText('Upcoming')).toBeInTheDocument();
    expect(screen.getByText('Later')).toBeInTheDocument();
    expect(screen.getByText('Soon')).toBeInTheDocument();
    expect(screen.getByText('Far off')).toBeInTheDocument();
    expect(screen.getAllByTestId('reminder-card')).toHaveLength(2);
  });

  it('treats reminders without a date as Later', () => {
    render(
      <RemindersList reminders={[makeReminder({ id: 3, title: 'No date' })]} />
    );

    expect(screen.getByText('Later')).toBeInTheDocument();
    expect(screen.queryByText('Upcoming')).not.toBeInTheDocument();
  });
});
