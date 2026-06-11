// Copyright © Todd Agriscience, Inc. All rights reserved.

import type { Metadata } from 'next';
import { getReminders } from './db';
import { CreateReminderDialog } from './create-reminder-dialog';
import { RemindersList } from './reminders-list';

export const metadata: Metadata = {
  title: { default: 'Reminders | Todd', template: '%s | Todd' },
};

/**
 * Reminders page displaying user reminders with seasonal date support.
 */
export default async function RemindersPage() {
  const reminders = await getReminders();

  return (
    <div className="max-w-2xl">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-[var(--color-foreground)]">
          Reminders
        </h1>
        <CreateReminderDialog />
      </div>

      <RemindersList reminders={reminders} />
    </div>
  );
}
