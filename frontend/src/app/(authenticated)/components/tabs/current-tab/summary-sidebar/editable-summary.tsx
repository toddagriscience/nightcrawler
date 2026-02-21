// Copyright © Todd Agriscience, Inc. All rights reserved.

'use client';

import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui';
import { IntegratedManagementPlanSelect } from '@/lib/types/db';
import { useCallback, useEffect, useRef, useState } from 'react';
import { updateImpSummary } from './actions';
import { Check, Pencil, X } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';

/** A single editable summary entry for an integrated management plan.
 *
 * @param imp - The integrated management plan to display a summary for
 * */
export default function EditableSummary({
  imp,
}: {
  imp: IntegratedManagementPlanSelect;
}) {
  const [isEditing, setIsEditing] = useState(false);
  const router = useRouter();
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { isSubmitting },
  } = useForm({
    defaultValues: { summary: imp.summary ?? '' },
  });

  const { ref: formRef, ...registerRest } = register('summary');

  const autoResize = useCallback(() => {
    const el = textareaRef.current;
    if (el) {
      el.style.height = 'auto';
      el.style.height = `${el.scrollHeight}px`;
    }
  }, []);

  useEffect(() => {
    if (isEditing) {
      autoResize();
    }
  }, [isEditing, autoResize]);

  async function onSubmit(data: { summary: string }) {
    await updateImpSummary(imp.id, data.summary);
    setIsEditing(false);
    router.refresh();
  }

  function handleCancel() {
    reset();
    setIsEditing(false);
  }

  return (
    <div className="border-b pb-3 last:border-b-0">
      <div className="mb-1 flex items-center justify-between">
        <p className="text-xs font-medium text-gray-500">
          {imp.createdAt.toLocaleDateString()}
        </p>
        {imp.updatedAt.toLocaleDateString() !==
          imp.createdAt.toLocaleDateString() && (
          <p className="text-xs font-medium text-gray-500">
            Updated {imp.updatedAt.toLocaleDateString()}
          </p>
        )}
        <Button
          variant="ghost"
          size="sm"
          className="h-4 w-4 p-0 hover:cursor-pointer"
          onClick={() => setIsEditing(true)}
          disabled={isEditing}
        >
          <Pencil className="h-3 w-3" />
        </Button>
      </div>
      {isEditing ? (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-2">
          <Textarea
            {...registerRest}
            ref={(el) => {
              formRef(el);
              textareaRef.current = el;
            }}
            onInput={autoResize}
            className="min-h-0 resize-none overflow-hidden text-sm"
            placeholder="Enter a summary..."
          />
          <div className="flex gap-1">
            <Button
              type="submit"
              variant="ghost"
              size="sm"
              className="h-6 w-6 p-0 hover:cursor-pointer"
              disabled={isSubmitting}
            >
              <Check className="h-3 w-3" />
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="h-6 w-6 p-0 hover:cursor-pointer"
              onClick={handleCancel}
              disabled={isSubmitting}
            >
              <X className="h-3 w-3" />
            </Button>
          </div>
        </form>
      ) : (
        <p className="text-sm text-gray-700">
          {imp.summary || (
            <span className="text-gray-400 italic">No summary</span>
          )}
        </p>
      )}
    </div>
  );
}
