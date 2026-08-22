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
    <div className="mx-auto max-w-2xl">
      <div className="mb-6 flex items-start justify-between gap-4">
        <div>
          <h1 className="text-3xl font-semibold text-foreground">Reminders</h1>
          <p className="mt-2 text-foreground/70">
            Keep track of seasonal tasks and important dates.
          </p>
        </div>
        <CreateReminderDialog />
      </div>

      <RemindersList reminders={reminders} />
    </div>
  );
}
