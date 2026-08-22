// Copyright © Todd Agriscience, Inc. All rights reserved.

'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Trash2, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import { logger } from '@/lib/logger';
import { ReminderForm } from './reminder-form';
import { updateReminder, deleteReminder } from './actions';
import type { Reminder } from './types';

interface ReminderEditSheetProps {
  reminder: Reminder;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

/** Slide-out sheet for editing, marking read, or deleting a reminder. */
export function ReminderEditSheet({
  reminder,
  open,
  onOpenChange,
}: ReminderEditSheetProps) {
  const router = useRouter();
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const handleDelete = async () => {
    try {
      await deleteReminder(reminder.id);
      router.refresh();
      onOpenChange(false);
    } catch (error) {
      logger.error('Failed to delete reminder:', error);
    }
  };

  const handleMarkRead = async () => {
    try {
      const formData = new FormData();
      formData.set('id', String(reminder.id));
      formData.set('action', 'mark_read');
      await updateReminder(formData);
      router.refresh();
    } catch (error) {
      logger.error('Failed to mark reminder as read:', error);
    }
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="sm:max-w-lg">
        <SheetHeader>
          <SheetTitle>Edit Reminder</SheetTitle>
          <SheetDescription>Make changes to your reminder.</SheetDescription>
        </SheetHeader>

        <div className="mt-6">
          <ReminderForm
            mode="edit"
            initialData={reminder}
            onSuccess={() => onOpenChange(false)}
            onCancel={() => onOpenChange(false)}
          />
        </div>

        <SheetFooter className="mt-6 pt-4 border-t border-[var(--color-border)]">
          <div className="flex items-center justify-between w-full">
            <div className="flex gap-2">
              {!reminder.read && (
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={handleMarkRead}
                  className="gap-1.5"
                >
                  <CheckCircle aria-hidden="true" className="size-3" />
                  Mark Read
                </Button>
              )}
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setShowDeleteConfirm(true)}
                className="gap-1.5 text-destructive hover:text-destructive"
              >
                <Trash2 aria-hidden="true" className="size-3" />
                Delete
              </Button>
            </div>

            {showDeleteConfirm && (
              <div className="flex items-center gap-2">
                <span className="text-sm text-[var(--color-muted-foreground)]">
                  Delete?
                </span>
                <Button
                  type="button"
                  variant="destructive"
                  size="sm"
                  onClick={handleDelete}
                >
                  Confirm
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setShowDeleteConfirm(false)}
                >
                  Cancel
                </Button>
              </div>
            )}
          </div>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
