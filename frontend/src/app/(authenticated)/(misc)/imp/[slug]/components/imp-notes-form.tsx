// Copyright © Todd Agriscience, Inc. All rights reserved.

'use client';

import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { formatActionResponseErrors } from '@/lib/utils/actions';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { saveImpNotes } from '../actions';

export function ImpNotesForm({
  articleId,
  initialNotes,
  initialUpdatedAt,
}: {
  articleId: number;
  initialNotes: string;
  initialUpdatedAt: string | null;
}) {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    clearErrors,
    setError,
    formState: { errors, isSubmitting, isDirty },
  } = useForm<ImpNotesFormValues>({
    defaultValues: {
      notes: initialNotes,
    },
  });

  const updatedAt = initialUpdatedAt;

  async function onSubmit(values: ImpNotesFormValues) {
    clearErrors();

    const result = await saveImpNotes(articleId, values.notes);
    const actionErrors = formatActionResponseErrors(result);

    if (actionErrors.length > 0) {
      setError('root', { message: actionErrors[0] });
      return;
    }

    router.refresh();
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="rounded-2xl border border-stone-200 bg-white p-5 shadow-sm"
    >
      <div className="mb-4">
        <h2 className="text-lg font-semibold text-foreground">Your notes</h2>
        <p className="mt-1 text-sm text-foreground/60">
          Save personal annotations for this IMP.
        </p>
      </div>

      <Textarea
        placeholder="Add farm-specific observations, follow-ups, or questions."
        className="h-64 resize-none w-full bg-stone-50"
        {...register('notes')}
      />

      {errors.root?.message && (
        <p className="mt-3 text-sm text-[#ff4d00]">{errors.root.message}</p>
      )}

      <div className="mt-4 flex items-center justify-between gap-4">
        <p className="min-h-4 min-w-48 text-xs text-foreground/50">
          {updatedAt && !isDirty
            ? `Last saved ${new Date(updatedAt).toLocaleString()}`
            : isDirty
              ? 'Unsaved changes'
              : 'No saved notes yet'}
        </p>
        <Button
          type="submit"
          variant="brand"
          disabled={isSubmitting}
          className="min-w-28"
        >
          {isSubmitting ? 'Saving...' : 'Save notes'}
        </Button>
      </div>
    </form>
  );
}
