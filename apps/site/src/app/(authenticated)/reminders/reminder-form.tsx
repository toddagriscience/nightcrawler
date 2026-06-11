// Copyright © Todd Agriscience, Inc. All rights reserved.

'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { logger } from '@/lib/logger';
import { parseSeasonalLabel } from './parse-seasonal';
import type { Reminder, ReminderType } from './types';
import { createReminder, updateReminderById } from './actions';

const reminderTypeOptions: { value: ReminderType; label: string }[] = [
  { value: 'planting', label: 'Planting' },
  { value: 'soil sample', label: 'Soil Sample' },
  { value: 'harvest', label: 'Harvest' },
  { value: 'deadline', label: 'Deadline' },
  { value: 'alert', label: 'Alert' },
  { value: 'system', label: 'System' },
  { value: 'other', label: 'Other' },
];

function formatDate(date: Date): string {
  return date.toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

interface ReminderFormProps {
  onSuccess: () => void;
  onCancel?: () => void;
  mode?: 'create' | 'edit';
  initialData?: Reminder;
}

/**
 * Form for creating or editing a reminder, with live seasonal-date preview.
 */
export function ReminderForm({
  onSuccess,
  onCancel,
  mode = 'create',
  initialData,
}: ReminderFormProps) {
  const router = useRouter();
  const [seasonalLabel, setSeasonalLabel] = useState(
    initialData?.seasonalLabel ?? ''
  );
  const [isSubmitting, setIsSubmitting] = useState(false);

  const parsedDate = seasonalLabel ? parseSeasonalLabel(seasonalLabel) : null;

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    const form = e.currentTarget;
    const formData = new FormData(form);

    const title = formData.get('title') as string;
    const body = formData.get('body') as string;
    const type = formData.get('type') as ReminderType;
    const dueDateStr = formData.get('dueDate') as string;
    const seasonalLabelVal = formData.get('seasonalLabel') as string;

    try {
      if (mode === 'edit' && initialData) {
        await updateReminderById(initialData.id, {
          title,
          body,
          type,
          dueDate: dueDateStr ? new Date(dueDateStr) : null,
          seasonalLabel: seasonalLabelVal || null,
        });
      } else {
        await createReminder({
          title,
          body,
          type,
          dueDate: dueDateStr ? new Date(dueDateStr) : null,
          seasonalLabel: seasonalLabelVal || null,
        });
      }
      router.refresh();
      onSuccess();
    } catch (error) {
      logger.error('Failed to save reminder:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="title">Title</Label>
        <Input
          id="title"
          name="title"
          defaultValue={initialData?.title ?? ''}
          placeholder="e.g., Apply pre-emergent herbicide"
          required
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="body">Notes</Label>
        <Textarea
          id="body"
          name="body"
          defaultValue={initialData?.body ?? ''}
          placeholder="Optional details..."
          rows={3}
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="type">Type</Label>
        <Select name="type" defaultValue={initialData?.type ?? 'other'}>
          <SelectTrigger>
            <SelectValue placeholder="Select type" />
          </SelectTrigger>
          <SelectContent>
            {reminderTypeOptions.map((opt) => (
              <SelectItem key={opt.value} value={opt.value}>
                {opt.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="seasonalLabel">Seasonal Label</Label>
        <Input
          id="seasonalLabel"
          name="seasonalLabel"
          value={seasonalLabel}
          onChange={(e) => setSeasonalLabel(e.target.value)}
          placeholder="e.g., mid March, early spring, 6 months from now"
        />
        <p className="text-xs text-[var(--color-muted-foreground)]">
          Examples: &quot;mid March&quot;, &quot;early spring&quot;, &quot;late
          summer&quot;, &quot;6 months from now&quot;, &quot;when soil warms
          up&quot;
        </p>
      </div>

      {seasonalLabel && (
        <div className="text-sm bg-[var(--color-success)]/10 text-[var(--color-success)] px-3 py-2 rounded-md">
          {parsedDate
            ? `Calculated date: ${formatDate(parsedDate)}`
            : 'Could not parse seasonal label'}
        </div>
      )}

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="dueDate">Or Exact Date</Label>
        <Input
          id="dueDate"
          name="dueDate"
          type="date"
          defaultValue={
            initialData?.dueDate
              ? new Date(initialData.dueDate).toISOString().split('T')[0]
              : ''
          }
        />
      </div>

      <div className="flex justify-end gap-2">
        {onCancel && (
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
        )}
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting
            ? 'Saving...'
            : mode === 'edit'
              ? 'Save Changes'
              : 'Create Reminder'}
        </Button>
      </div>
    </form>
  );
}
