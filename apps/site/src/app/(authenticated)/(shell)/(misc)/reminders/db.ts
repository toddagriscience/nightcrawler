// Copyright © Todd Agriscience, Inc. All rights reserved.

import { desc, eq } from 'drizzle-orm';
import { db } from '@nightcrawler/db/schema/connection';
import { reminder } from '@nightcrawler/db/schema/reminder';
import { getAuthenticatedInfo } from '@/lib/utils/get-authenticated-info';
import type { Reminder } from './types';

/** Fetch all reminders for the current user, newest first. */
export async function getReminders(): Promise<Reminder[]> {
  const currentUser = await getAuthenticatedInfo();
  const rows = await db
    .select()
    .from(reminder)
    .where(eq(reminder.userId, currentUser.id))
    .orderBy(desc(reminder.createdAt));
  return rows;
}
