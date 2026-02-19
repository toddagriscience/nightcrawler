// Copyright © Todd Agriscience, Inc. All rights reserved.

'use client';

import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui';
import { IntegratedManagementPlanSelect } from '@/lib/types/db';
import { useState } from 'react';
import { updateImpSummary } from './actions';
import { Check, Pencil, X } from 'lucide-react';
import { useRouter } from 'next/navigation';

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
  const [summary, setSummary] = useState(imp.summary ?? '');
  const [isSaving, setIsSaving] = useState(false);
  const router = useRouter();

  async function handleSave() {
    setIsSaving(true);
    await updateImpSummary(imp.id, summary);
    setIsSaving(false);
    setIsEditing(false);
    router.refresh();
  }

  function handleCancel() {
    setSummary(imp.summary ?? '');
    setIsEditing(false);
  }

  return (
    <div className="border-b pb-3 last:border-b-0">
      <div className="mb-1 flex items-center justify-between">
        <p className="text-xs font-medium text-gray-500">
          {imp.initialized.toLocaleDateString()}
        </p>
        {!isEditing && (
          <Button
            variant="ghost"
            size="sm"
            className="h-6 w-6 p-0 hover:cursor-pointer"
            onClick={() => setIsEditing(true)}
          >
            <Pencil className="h-3 w-3" />
          </Button>
        )}
      </div>
      {isEditing ? (
        <div className="space-y-2">
          <Textarea
            value={summary}
            onChange={(e) => setSummary(e.target.value)}
            className="min-h-[60px] text-sm"
            placeholder="Enter a summary..."
          />
          <div className="flex gap-1">
            <Button
              variant="ghost"
              size="sm"
              className="h-6 w-6 p-0 hover:cursor-pointer"
              onClick={handleSave}
              disabled={isSaving}
            >
              <Check className="h-3 w-3" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="h-6 w-6 p-0 hover:cursor-pointer"
              onClick={handleCancel}
              disabled={isSaving}
            >
              <X className="h-3 w-3" />
            </Button>
          </div>
        </div>
      ) : (
        <p className="text-sm text-gray-700">
          {imp.summary || (
            <span className="italic text-gray-400">No summary</span>
          )}
        </p>
      )}
    </div>
  );
}
