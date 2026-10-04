// Copyright © Todd Agriscience, Inc. All rights reserved.

'use client';

import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { logger } from '@/lib/logger';
import { cn } from '@/lib/utils';
import { CalendarIcon } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useMemo, useState } from 'react';
import { createReminder, updateReminderById } from './actions';
import { parseSeasonalLabel } from './parse-seasonal';
import type { Reminder, ReminderType } from './types';

const reminderTypeOptions: { value: ReminderType; label: string }[] = [
  { value: 'planting', label: 'Planting' },
  { value: 'soil sample', label: 'Soil Sample' },
  { value: 'harvest', label: 'Harvest' },
  { value: 'deadline', label: 'Deadline' },
  { value: 'alert', label: 'Alert' },
  { value: 'system', label: 'System' },
  { value: 'other', label: 'Other' },
];

const JANUARY = 0;
const DECEMBER = 11;
const CALENDAR_YEARS_BACK = 50;
const CALENDAR_YEARS_AHEAD = 10;
const EXACT_DATE_LABEL = 'Or Exact Date';
const UNSET_DATE_LABEL = 'Select date';

function formatDate(date: Date): string {
  return date.toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

function formatTriggerDate(value: Date | undefined) {
  if (!value) {
    return UNSET_DATE_LABEL;
  }

  return value.toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });
}

/**
 * Converts a stored timestamp, treated as UTC midnight of a calendar day, into
 * the local midnight date react-day-picker expects.
 * @param {Date | null | undefined} value - The date read from the database
 * @returns {Date | undefined} The equivalent day at local midnight
 */
function toCalendarDate(value: Date | null | undefined) {
  if (!value) {
    return undefined;
  }

  return new Date(
    value.getUTCFullYear(),
    value.getUTCMonth(),
    value.getUTCDate()
  );
}

/**
 * Converts the local midnight date react-day-picker returns back to UTC
 * midnight so the due day does not shift for users east of UTC.
 * @param {Date | undefined} value - The day picked in the calendar
 * @returns {Date | null} The equivalent day at UTC midnight
 */
function fromCalendarDate(value: Date | undefined) {
  if (!value) {
    return null;
  }

  return new Date(
    Date.UTC(value.getFullYear(), value.getMonth(), value.getDate())
  );
}

/**
 * Calendar-backed replacement for a native date input. The trigger is a button,
 * so the visible label is not a `<label for>` and the button names itself.
 */
function ExactDateField({
  value,
  onChange,
  disabled,
}: {
  value: Date | undefined;
  onChange: (date: Date | undefined) => void;
  disabled: boolean;
}) {
  const [open, setOpen] = useState(false);
  const displayValue = formatTriggerDate(value);

  const [startMonth, endMonth] = useMemo(() => {
    const currentYear = new Date().getFullYear();

    return [
      new Date(currentYear - CALENDAR_YEARS_BACK, JANUARY),
      new Date(currentYear + CALENDAR_YEARS_AHEAD, DECEMBER),
    ];
  }, []);

  return (
    <div className="flex flex-col gap-1.5">
      <span
        aria-hidden="true"
        className="flex items-center gap-2 text-sm leading-none font-medium select-none"
      >
        {EXACT_DATE_LABEL}
      </span>
      <Popover modal open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            id="dueDate"
            type="button"
            variant="outline"
            disabled={disabled}
            aria-label={`${EXACT_DATE_LABEL}: ${displayValue}`}
            className={cn(
              'h-10 w-full justify-start border-foreground/15 font-normal hover:bg-transparent',
              !value && 'text-muted-foreground'
            )}
          >
            <CalendarIcon aria-hidden="true" className="size-4" />
            {displayValue}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="z-[100] w-auto border-0 p-0" align="start">
          <Calendar
            autoFocus
            mode="single"
            captionLayout="dropdown"
            startMonth={startMonth}
            endMonth={endMonth}
            selected={value}
            defaultMonth={value}
            className="border-foreground/15"
            classNames={{
              dropdown_root:
                'has-focus:border-foreground/15 border-foreground/15 shadow-xs has-focus:ring-ring/50 has-focus:ring-1 relative rounded-md border-1',
            }}
            onSelect={(date) => {
              onChange(date);
              setOpen(false);
            }}
          />
        </PopoverContent>
      </Popover>
    </div>
  );
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
  const [dueDate, setDueDate] = useState<Date | undefined>(
    toCalendarDate(initialData?.dueDate)
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
    let seasonalLabelVal = formData.get('seasonalLabel') as string;

    // Mutual exclusion guard: an exact date and a seasonal label must never both
    // be stored. If both are somehow present, keep only the exact date.
    if (seasonalLabelVal && dueDate) {
      seasonalLabelVal = '';
    }

    try {
      if (mode === 'edit' && initialData) {
        await updateReminderById(initialData.id, {
          title,
          body,
          type,
          dueDate: fromCalendarDate(dueDate),
          seasonalLabel: seasonalLabelVal || null,
        });
      } else {
        await createReminder({
          title,
          body,
          type,
          dueDate: fromCalendarDate(dueDate),
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
          className="border-foreground/15"
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
          className="border-foreground/15"
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="type">Type</Label>
        <Select name="type" defaultValue={initialData?.type ?? 'other'}>
          <SelectTrigger className="border border-foreground/15 px-3">
            <SelectValue placeholder="Select type" />
          </SelectTrigger>
          <SelectContent className="border-foreground/15">
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
          disabled={dueDate !== undefined}
          placeholder="e.g., mid March, early spring, 6 months from now"
          className="border-foreground/15"
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

      <ExactDateField
        value={dueDate}
        onChange={setDueDate}
        disabled={seasonalLabel !== ''}
      />

      <div className="flex justify-end gap-2">
        {onCancel && (
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            className="border-foreground/15"
          >
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
