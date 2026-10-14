// Copyright © Todd Agriscience, Inc. All rights reserved.

'use client';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Plus } from 'lucide-react';
import { useState } from 'react';
import { IrisButton } from '../../../../../components/common/iris-button/iris-button';
import { ReminderForm } from './reminder-form';

/** Button + dialog for creating a new reminder. */
export function CreateReminderDialog() {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <IrisButton variant="outline" type="button" className="gap-2">
          <Plus aria-hidden="true" className="size-4" />
          New Reminder
        </IrisButton>
      </DialogTrigger>
      <DialogContent className="border-foreground/15">
        <DialogHeader>
          <DialogTitle>Create New Reminder</DialogTitle>
          <DialogDescription>
            Set a reminder with a seasonal label or exact date.
          </DialogDescription>
        </DialogHeader>
        <ReminderForm onSuccess={() => setOpen(false)} />
      </DialogContent>
    </Dialog>
  );
}
