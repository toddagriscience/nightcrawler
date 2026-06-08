// Copyright © Todd Agriscience, Inc. All rights reserved.

'use client';

import { useState, useTransition } from 'react';
import { createReminder } from '@/app/(authenticated)/reminders/actions';
import { parseSeasonalLabel } from '@/app/(authenticated)/reminders/parse-seasonal';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { formatActionResponseErrors } from '@/lib/utils/actions';
import { useRouter } from 'next/navigation';

type ReminderType = 'planting' | 'soil sample' | 'harvest' | 'other';

const REMINDER_TYPES: { value: ReminderType; label: string }[] = [
  { value: 'planting', label: 'Planting' },
  { value: 'soil sample', label: 'Soil sample' },
  { value: 'harvest', label: 'Harvest' },
  { value: 'other', label: 'Other' },
];

interface SetReminderFormProps {
  articleId: number;
  articleTitle: string;
}

export function SetReminderForm({
  articleId,
  articleTitle,
}: SetReminderFormProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [type, setType] = useState<ReminderType>('planting');
  const [title, setTitle] = useState(articleTitle);
  const [body, setBody] = useState('');
  const [seasonalLabel, setSeasonalLabel] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [showExactDate, setShowExactDate] = useState(false);
  const [parsedDate, setParsedDate] = useState<Date | null>(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  function handleSeasonalChange(value: string) {
    setSeasonalLabel(value);
    if (value.trim()) {
      const parsed = parseSeasonalLabel(value);
      setParsedDate(parsed);
    } else {
      setParsedDate(null);
    }
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim()) {
      setError('Title is required');
      return;
    }
    setError('');
    setSuccess(false);
    startTransition(async () => {
      try {
        const result = await createReminder({
          title: title.trim(),
          body: body.trim(),
          type,
          seasonalLabel: seasonalLabel.trim() || null,
          dueDate: showExactDate && dueDate ? new Date(dueDate) : null,
        });
        if (result.error) {
          setError(result.error);
        } else {
          setSuccess(true);
          setBody('');
          setSeasonalLabel('');
          setDueDate('');
          setParsedDate(null);
          setShowExactDate(false);
          router.refresh();
        }
      } catch (err) {
        const errors = formatActionResponseErrors(err);
        setError(errors[0] ?? 'Something went wrong');
      }
    });
  }

  return (
    <div className="rounded-xl border border-stone-200 bg-white p-5 shadow-sm">
      {/* Header */}
      <div className="mb-4">
        <p className="text-xs font-medium uppercase tracking-widest text-muted-foreground">
          Set a reminder
        </p>
        <h2 className="mt-1 text-base font-semibold text-foreground">
          {articleTitle}
        </h2>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Title */}
        <div>
          <Input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Reminder title"
            className="h-9 w-full border-stone-200 bg-white text-sm focus-visible:ring-1 focus-visible:ring-stone-400"
          />
        </div>

        {/* Type chips */}
        <div className="flex flex-wrap gap-1.5">
          {REMINDER_TYPES.map((t) => (
            <button
              key={t.value}
              type="button"
              onClick={() => setType(t.value)}
              className={`rounded-full border border-stone-200 px-2.5 py-1 text-xs transition-all ${
                type === t.value
                  ? 'bg-accent text-foreground font-semibold'
                  : 'text-muted-foreground hover:bg-accent hover:text-foreground'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* Seasonal label */}
        <div>
          <Input
            value={seasonalLabel}
            onChange={(e) => handleSeasonalChange(e.target.value)}
            placeholder="e.g., mid March, early spring"
            className="h-9 w-full border-stone-200 bg-white text-sm focus-visible:ring-1 focus-visible:ring-stone-400"
          />
          {parsedDate && (
            <p className="mt-1 text-xs text-muted-foreground">
              &#8594;{' '}
              {parsedDate.toLocaleDateString('en-US', {
                month: 'long',
                day: 'numeric',
                year: 'numeric',
              })}
            </p>
          )}
          {seasonalLabel && !parsedDate && (
            <p className="mt-1 text-xs text-muted-foreground/60">
              Could not parse &#8212; try &ldquo;mid March&rdquo; or &ldquo;6
              months from now&rdquo;
            </p>
          )}
        </div>

        {/* Exact date toggle */}
        <div>
          <button
            type="button"
            onClick={() => setShowExactDate(!showExactDate)}
            className="text-xs text-muted-foreground transition-colors hover:text-foreground"
          >
            {showExactDate ? '▲ Hide exact date' : '▼ Add exact date'}
          </button>
          {showExactDate && (
            <Input
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              className="mt-1 h-9 w-full border-stone-200 bg-white text-sm focus-visible:ring-1 focus-visible:ring-stone-400"
            />
          )}
        </div>

        {/* Notes */}
        <Textarea
          value={body}
          onChange={(e) => setBody(e.target.value)}
          placeholder="Notes (optional)..."
          className="h-20 w-full resize-none border-stone-200 bg-white text-sm focus-visible:ring-1 focus-visible:ring-stone-400"
        />

        {/* Error / success */}
        {error && <p className="text-xs text-red-500">{error}</p>}
        {success && (
          <p className="text-xs text-foreground font-medium">
            &#10003; Reminder set
          </p>
        )}

        {/* Submit */}
        <Button
          type="submit"
          disabled={isPending || !title.trim()}
          className="w-full text-sm font-medium"
          variant="brand"
        >
          {isPending ? 'Setting...' : 'Set reminder'}
        </Button>
      </form>
    </div>
  );
}
