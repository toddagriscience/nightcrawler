// Copyright © Todd Agriscience, Inc. All rights reserved.

'use server';

import { eq } from 'drizzle-orm';
import { db } from '@nightcrawler/db/schema/connection';
import { reminder } from '@nightcrawler/db/schema/reminder';
import { logger } from '@/lib/logger';
import type { ReminderAction } from './types';

/** Server action to dismiss or mark a reminder as read. */
export async function updateReminder(
  _prevState: unknown,
  formData: FormData
): Promise<{ success: boolean; error?: string }> {
  const idStr = formData.get('id');
  const action = formData.get('action');

  if (!idStr || !action) {
    return { success: false, error: 'Missing id or action' };
  }

  const id = Number(idStr);
  const actionStr = String(action);

  if (actionStr === 'dismiss') {
    const { error } = await db.delete(reminder).where(eq(reminder.id, id));
    if (error) {
      logger.error('[reminders] dismiss failed', { error, id });
      return { success: false, error: 'Failed to dismiss reminder' };
    }
    return { success: true };
  }

  if (actionStr === 'mark_read') {
    const { error } = await db
      .update(reminder)
      .set({ read: true })
      .where(eq(reminder.id, id));
    if (error) {
      logger.error('[reminders] mark_read failed', { error, id });
      return { success: false, error: 'Failed to mark reminder as read' };
    }
    return { success: true };
  }

  return { success: false, error: 'Unknown action' };
}
