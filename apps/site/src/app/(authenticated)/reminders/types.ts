// Copyright © Todd Agriscience, Inc. All rights reserved.

export type Reminder = {
  id: number;
  type: 'system' | 'deadline' | 'alert';
  title: string;
  body: string;
  read: boolean;
  createdAt: Date;
  href: string | null;
  dueDate: Date | null;
  seasonalLabel: string | null;
};

export type ReminderAction =
  | { id: number; action: 'dismiss' }
  | { id: number; action: 'mark_read' };

export type ReminderType =
  | 'system'
  | 'deadline'
  | 'alert'
  | 'planting'
  | 'soil sample'
  | 'harvest'
  | 'other';

export type CreateReminderInput = {
  title: string;
  body: string;
  type: ReminderType;
  dueDate?: Date | null;
  seasonalLabel?: string | null;
};

export type UpdateReminderInput = Partial<CreateReminderInput>;
