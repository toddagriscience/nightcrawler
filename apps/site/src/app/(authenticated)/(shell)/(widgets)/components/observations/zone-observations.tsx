// Copyright © Todd Agriscience, Inc. All rights reserved.

'use client';

import { logger } from '@/lib/logger';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { deleteObservation } from '../../actions';
import { formatObservationDate } from './observation-dates';
import { ObservationDialog } from './observation-dialog';
import type { ZoneObservation } from './types';

interface ZoneObservationsProps {
  /** Selected management zone id. */
  zoneId: number;
  /** Selected management zone name. */
  zoneName: string;
  /** Observations already saved for this zone, oldest day first. */
  observations: ZoneObservation[];
}

/**
 * Empty state and saved notes for one management zone.
 *
 * @param props - Zone identity and its observations.
 * @returns The observations list, or the dashed add control when empty.
 */
export function ZoneObservations({
  zoneId,
  zoneName,
  observations,
}: ZoneObservationsProps) {
  const router = useRouter();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<ZoneObservation | undefined>(
    undefined
  );
  const [pendingDeleteId, setPendingDeleteId] = useState<number | null>(null);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  function openCreate() {
    setEditing(undefined);
    setDialogOpen(true);
  }

  function openEdit(observation: ZoneObservation) {
    setPendingDeleteId(null);
    setDeleteError(null);
    setEditing(observation);
    setDialogOpen(true);
  }

  async function confirmDelete(id: number) {
    setDeleteError(null);
    try {
      await deleteObservation(id);
      setPendingDeleteId(null);
      router.refresh();
    } catch (error) {
      logger.error('Failed to delete observation:', error);
      setDeleteError(
        error instanceof Error ? error.message : 'Failed to delete observation'
      );
    }
  }

  return (
    <>
      {observations.length === 0 ? (
        <button
          type="button"
          onClick={openCreate}
          className="border-foreground/20 text-foreground/50 hover:text-foreground mt-4 w-full rounded-md border border-dashed px-4 py-3 text-left text-sm"
        >
          + Add an observation to {zoneName}
        </button>
      ) : (
        <div className="mt-5">
          <ul className="flex flex-col gap-6">
            {observations.map((observation) => {
              const confirmingDelete = pendingDeleteId === observation.id;

              return (
                <li
                  key={observation.id}
                  className="border-l border-foreground pl-2"
                >
                  <p className="text-sm text-foreground">{observation.body}</p>
                  <div className="mt-2 flex flex-wrap items-center gap-x-6 gap-y-1 text-sm text-foreground/50">
                    <span>{formatObservationDate(observation.observedOn)}</span>
                    {confirmingDelete ? (
                      <>
                        <span>Delete?</span>
                        <button
                          type="button"
                          onClick={() => confirmDelete(observation.id)}
                          className="text-destructive hover:text-destructive/90"
                        >
                          Confirm
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setPendingDeleteId(null);
                            setDeleteError(null);
                          }}
                          className="hover:text-foreground"
                        >
                          Cancel
                        </button>
                      </>
                    ) : (
                      <>
                        <button
                          type="button"
                          onClick={() => openEdit(observation)}
                          className="hover:text-foreground"
                        >
                          Edit
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setDeleteError(null);
                            setPendingDeleteId(observation.id);
                          }}
                          className="hover:text-destructive/90"
                        >
                          Delete
                        </button>
                      </>
                    )}
                  </div>
                  {confirmingDelete && deleteError ? (
                    <p role="alert" className="mt-1 text-sm text-destructive">
                      {deleteError}
                    </p>
                  ) : null}
                </li>
              );
            })}
          </ul>
          <button
            type="button"
            onClick={openCreate}
            className="mt-6 text-left text-sm text-foreground underline"
          >
            + Add an observation to {zoneName}
          </button>
        </div>
      )}

      <ObservationDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        zoneId={zoneId}
        zoneName={zoneName}
        observation={editing}
      />
    </>
  );
}
