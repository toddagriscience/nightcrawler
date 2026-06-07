// Copyright © Todd Agriscience, Inc. All rights reserved.

export type Reminder = {
  id: number;
  type: 'system' | 'deadline' | 'alert';
  title: string;
  body: string;
  read: boolean;
  createdAt: Date;
  href: string | null;
};

export type ReminderAction =
  | { id: number; action: 'dismiss' }
  | { id: number; action: 'mark_read' };
