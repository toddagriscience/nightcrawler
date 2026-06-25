// Copyright © Todd Agriscience, Inc. All rights reserved.

'use client';

import { useState } from 'react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { updateFarmAdvisorProfileNotes } from '../actions';

/** Props for {@link FarmAdvisorProfileNotes}. */
export interface FarmAdvisorProfileNotesProps {
  /** Linked farm id after signup */
  farmId: number;
  /** Current markdown notes from the server */
  initialNotes: string;
}

/**
 * Advisor-maintained farm profile notes for alignment and future Iris context.
 *
 * @param props - Farm id and initial notes
 */
export default function FarmAdvisorProfileNotes({
  farmId,
  initialNotes,
}: FarmAdvisorProfileNotesProps) {
  const [notes, setNotes] = useState(initialNotes);
  const [loading, setLoading] = useState(false);

  const handleSave = async () => {
    setLoading(true);
    try {
      const result = await updateFarmAdvisorProfileNotes(farmId, notes);
      if (!result.success) {
        toast.error(result.error ?? 'Failed to save farm profile notes.');
        return;
      }

      toast.success('Farm profile notes saved.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-3 rounded-md border p-4">
      <div>
        <h2 className="text-sm font-medium">Farm profile notes</h2>
        <p className="text-sm text-muted-foreground mt-1">
          Markdown-style context for advisor review and future Iris answers.
          Seeded from the access request when the client finishes signup.
        </p>
      </div>
      <Textarea
        value={notes}
        onChange={(event) => setNotes(event.target.value)}
        className="min-h-48 font-mono text-sm"
        aria-label="Farm profile notes"
      />
      <Button
        type="button"
        size="sm"
        disabled={loading}
        onClick={() => void handleSave()}
      >
        {loading ? 'Saving…' : 'Save notes'}
      </Button>
    </div>
  );
}
