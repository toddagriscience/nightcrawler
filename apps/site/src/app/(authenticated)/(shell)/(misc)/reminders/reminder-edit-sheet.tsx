// Copyright © Todd Agriscience, Inc. All rights reserved.

'use client';

import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import { logger } from '@/lib/logger';
import { CheckCircle, Trash2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { IrisButton } from '../../../../../components/common/iris-button/iris-button';
import { deleteReminder, updateReminder } from './actions';
import { ReminderForm } from './reminder-form';
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
      <SheetContent className="sm:max-w-lg border-foreground/15">
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

        <SheetFooter className="mt-6 pt-4 border-t border-foreground/15">
          <div className="flex items-center justify-between w-full">
            <div className="flex gap-2">
              {!reminder.read && (
                <IrisButton variant="primary" onClick={handleMarkRead}>
                  <CheckCircle aria-hidden="true" className="size-3" />
                  Mark Read
                </IrisButton>
              )}
              <IrisButton
                type="button"
                variant="outline"
                onClick={() => setShowDeleteConfirm(true)}
              >
                <Trash2 aria-hidden="true" className="size-3" />
                Delete
              </IrisButton>
            </div>

            {showDeleteConfirm && (
              <div className="flex items-center gap-2">
                <span className="text-sm text-[var(--color-muted-foreground)]">
                  Delete?
                </span>
                <IrisButton
                  variant="destructive"
                  type="button"
                  onClick={handleDelete}
                >
                  Confirm
                </IrisButton>
                <IrisButton
                  variant="outline"
                  type="button"
                  onClick={() => setShowDeleteConfirm(false)}
                >
                  Cancel
                </IrisButton>
              </div>
            )}
          </div>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
