// Copyright © Todd Agriscience, Inc. All rights reserved.

'use server';

import { eq } from 'drizzle-orm';
import { db } from '@nightcrawler/db/schema/connection';
import { reminder } from '@nightcrawler/db/schema/reminder';
import { logger } from '@/lib/logger';
import { ActionResponse } from '@/lib/types/action-response';
import { throwActionError } from '@/lib/utils/actions';
import { getAuthenticatedInfo } from '@/lib/utils/get-authenticated-info';
import type {
  CreateReminderInput,
  ReminderType,
  UpdateReminderInput,
} from './types';
import { revalidatePath } from 'next/cache';

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

/**
 * Creates a new reminder for the current user.
 *
 * @param input - Reminder creation data
 * @returns ActionResponse with created reminder id
 */
export async function createReminder(
  input: CreateReminderInput
): Promise<ActionResponse> {
  try {
    const currentUser = await getAuthenticatedInfo();

    if (!input.title.trim()) {
      throwActionError('Title is required');
    }

    if (!input.type) {
      throwActionError('Type is required');
    }

    const [newReminder] = await db
      .insert(reminder)
      .values({
        userId: currentUser.id,
        title: input.title.trim(),
        body: input.body?.trim() ?? '',
        type: input.type as ReminderType,
        dueDate: input.dueDate ?? null,
        seasonalLabel: input.seasonalLabel?.trim() ?? null,
      })
      .returning({ id: reminder.id });

    revalidatePath('/reminders');

    return { data: { id: newReminder.id } };
  } catch (error) {
    logger.error(error);
    if (error instanceof Error) {
      throwActionError(error.message);
    }
    throwActionError('Failed to create reminder');
  }
}

/**
 * Updates an existing reminder.
 *
 * @param id - Reminder id
 * @param input - Reminder update data
 * @returns ActionResponse
 */
export async function updateReminderById(
  id: number,
  input: UpdateReminderInput
): Promise<ActionResponse> {
  try {
    await getAuthenticatedInfo();

    if (!Number.isInteger(id) || id <= 0) {
      throwActionError('Invalid reminder id');
    }

    const updateData: Partial<{
      title: string;
      body: string;
      type: ReminderType;
      dueDate: Date | null;
      seasonalLabel: string | null;
      read: boolean;
    }> = {};

    if (input.title !== undefined) {
      if (!input.title.trim()) {
        throwActionError('Title cannot be empty');
      }
      updateData.title = input.title.trim();
    }

    if (input.body !== undefined) {
      updateData.body = input.body.trim();
    }

    if (input.type !== undefined) {
      updateData.type = input.type as ReminderType;
    }

    if (input.dueDate !== undefined) {
      updateData.dueDate = input.dueDate;
    }

    if (input.seasonalLabel !== undefined) {
      updateData.seasonalLabel = input.seasonalLabel?.trim() ?? null;
    }

    await db.update(reminder).set(updateData).where(eq(reminder.id, id));

    revalidatePath('/reminders');

    return {};
  } catch (error) {
    logger.error(error);
    if (error instanceof Error) {
      throwActionError(error.message);
    }
    throwActionError('Failed to update reminder');
  }
}

/**
 * Deletes a reminder by id.
 *
 * @param id - Reminder id
 * @returns ActionResponse
 */
export async function deleteReminder(id: number): Promise<ActionResponse> {
  try {
    if (!Number.isInteger(id) || id <= 0) {
      throwActionError('Invalid reminder id');
    }

    await db.delete(reminder).where(eq(reminder.id, id));

    revalidatePath('/reminders');

    return {};
  } catch (error) {
    logger.error(error);
    if (error instanceof Error) {
      throwActionError(error.message);
    }
    throwActionError('Failed to delete reminder');
  }
}

/**
 * Marks a reminder as read.
 *
 * @param id - Reminder id
 * @returns ActionResponse
 */
export async function markReminderRead(id: number): Promise<ActionResponse> {
  try {
    if (!Number.isInteger(id) || id <= 0) {
      throwActionError('Invalid reminder id');
    }

    await db.update(reminder).set({ read: true }).where(eq(reminder.id, id));

    revalidatePath('/reminders');

    return {};
  } catch (error) {
    logger.error(error);
    if (error instanceof Error) {
      throwActionError(error.message);
    }
    throwActionError('Failed to mark reminder as read');
  }
}
