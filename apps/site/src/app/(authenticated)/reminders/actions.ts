// Copyright © Todd Agriscience, Inc. All rights reserved.

'use server';

import { eq } from 'drizzle-orm';
import { db } from '@nightcrawler/db/schema/connection';
import { reminder } from '@nightcrawler/db/schema/reminder';
import { logger } from '@/lib/logger';
import type { ReminderAction } from './types';

/** Server action to dismiss or mark a reminder as read. */
export async function updateReminder(formData: FormData): Promise<void> {
  const idStr = formData.get('id');
  const action = formData.get('action');

  if (!idStr || !action) {
    throw new Error('Missing id or action');
  }

  const id = Number(idStr);
  const actionStr = String(action);

  if (actionStr === 'dismiss') {
    await db.delete(reminder).where(eq(reminder.id, id));
    return;
  }

  if (actionStr === 'mark_read') {
    await db.update(reminder).set({ read: true }).where(eq(reminder.id, id));
    return;
  }

  throw new Error('Unknown action');
}
