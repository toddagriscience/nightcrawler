// Copyright © Todd Agriscience, Inc. All rights reserved.

'use client';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { ObservationForm } from './observation-form';
import type { ZoneObservation } from './types';

interface ObservationDialogProps {
  /** Whether the dialog is open. */
  open: boolean;
  /** Updates the open state. */
  onOpenChange: (open: boolean) => void;
  /** Management zone the note is saved against. */
  zoneId: number;
  /** Zone name used in the description. */
  zoneName: string;
  /** Existing observation when editing. Omit to create. */
  observation?: ZoneObservation;
}

/**
 * Centered dialog for adding or editing a zone observation.
 *
 * @param props - Dialog state, zone, and the observation being edited.
 * @returns The observation dialog.
 */
export function ObservationDialog({
  open,
  onOpenChange,
  zoneId,
  zoneName,
  observation,
}: ObservationDialogProps) {
  const isEdit = observation !== undefined;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="border-foreground/15">
        <DialogHeader>
          <DialogTitle>
            {isEdit ? 'Edit observation' : 'Add an observation'}
          </DialogTitle>
          <DialogDescription>
            {isEdit
              ? `Update this note for ${zoneName}.`
              : `Record a note for ${zoneName}.`}
          </DialogDescription>
        </DialogHeader>
        {open ? (
          <ObservationForm
            key={observation?.id ?? 'new'}
            zoneId={zoneId}
            observation={observation}
            onSuccess={() => onOpenChange(false)}
            onCancel={() => onOpenChange(false)}
          />
        ) : null}
      </DialogContent>
    </Dialog>
  );
}
