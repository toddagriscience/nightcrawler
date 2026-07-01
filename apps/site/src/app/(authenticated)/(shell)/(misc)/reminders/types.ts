// Copyright © Todd Agriscience, Inc. All rights reserved.

/** Reminder categories surfaced to users, including agronomic event types. */
export type ReminderType =
  | 'system'
  | 'deadline'
  | 'alert'
  | 'planting'
  | 'soil sample'
  | 'harvest'
  | 'other';

/** A user reminder, mirroring the `reminder` table schema. */
export type Reminder = {
  id: number;
  type: ReminderType;
  title: string;
  body: string;
  read: boolean;
  createdAt: Date;
  href: string | null;
  dueDate: Date | null;
  seasonalLabel: string | null;
};

/** Discriminated union of quick reminder actions performed from a card. */
export type ReminderAction =
  | { id: number; action: 'dismiss' }
  | { id: number; action: 'mark_read' };

/** Input payload for creating a new reminder. */
export type CreateReminderInput = {
  title: string;
  body: string;
  type: ReminderType;
  dueDate?: Date | null;
  seasonalLabel?: string | null;
};

/** Input payload for updating an existing reminder. */
export type UpdateReminderInput = Partial<CreateReminderInput>;
