// Copyright © Todd Agriscience, Inc. All rights reserved.

'use client';

import {
  Bell,
  CheckCircle,
  AlertTriangle,
  Clock,
  Sprout,
  Beaker,
  Wheat,
  HelpCircle,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { updateReminder } from './actions';
import type { Reminder, ReminderType } from './types';
import { parseSeasonalLabel } from './parse-seasonal';

const typeIcons: Record<ReminderType, typeof Bell> = {
  system: Bell,
  deadline: Clock,
  alert: AlertTriangle,
  planting: Sprout,
  'soil sample': Beaker,
  harvest: Wheat,
  other: HelpCircle,
};

const typeColors: Record<ReminderType, string> = {
  system: 'text-[var(--color-foreground)]',
  deadline: 'text-[var(--color-warning)]',
  alert: 'text-[var(--color-alert)]',
  planting: 'text-[var(--color-success)]',
  'soil sample': 'text-[var(--color-info)]',
  harvest: 'text-[var(--color-warning)]',
  other: 'text-[var(--color-muted-foreground)]',
};

function formatDate(date: Date): string {
  return date.toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

interface ReminderCardProps {
  reminder: Reminder;
  onEdit: (reminder: Reminder) => void;
}

/** Single reminder row with quick mark-read / dismiss actions and edit trigger. */
export function ReminderCard({ reminder: r, onEdit }: ReminderCardProps) {
  const Icon = typeIcons[r.type] ?? typeIcons.other;
  const effectiveDate = r.dueDate
    ? new Date(r.dueDate)
    : r.seasonalLabel
      ? parseSeasonalLabel(r.seasonalLabel)
      : null;

  return (
    <div className="group relative flex gap-4 px-4 py-5 rounded-lg hover:bg-[var(--color-background)]/50 transition-colors duration-200 border border-transparent hover:border-[var(--color-border)]/30">
      <Icon
        aria-hidden="true"
        className={`size-5 mt-0.5 shrink-0 ${typeColors[r.type] ?? typeColors.other}`}
      />
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1 min-w-0">
            {r.href ? (
              <a
                href={r.href}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm font-semibold text-[var(--color-foreground)] hover:opacity-80 transition-opacity"
              >
                {r.title}
              </a>
            ) : (
              <p className="text-sm font-semibold text-[var(--color-foreground)]">
                {r.title}
              </p>
            )}
            {r.seasonalLabel && (
              <p className="text-base font-medium text-[var(--color-primary)] mt-1 capitalize">
                {r.seasonalLabel}
              </p>
            )}
            {effectiveDate && (
              <p className="text-xs text-[var(--color-muted-foreground)] mt-0.5">
                {formatDate(effectiveDate)}
              </p>
            )}
          </div>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="h-8 w-8 p-0 text-[var(--color-muted-foreground)] hover:text-[var(--color-foreground)] opacity-0 group-hover:opacity-100 transition-opacity duration-200"
            onClick={() => onEdit(r)}
          >
            <svg
              aria-hidden="true"
              className="size-3.5"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
              />
            </svg>
            <span className="sr-only">Edit</span>
          </Button>
        </div>
        <p className="text-sm text-[var(--color-muted-foreground)] mt-2 line-clamp-2 leading-relaxed">
          {r.body}
        </p>
        <div className="flex items-center gap-3 mt-3 opacity-60 group-hover:opacity-100 transition-opacity duration-200">
          {!r.read && (
            <form action={updateReminder}>
              <input type="hidden" name="id" value={r.id} />
              <input type="hidden" name="action" value="mark_read" />
              <Button
                type="submit"
                variant="ghost"
                className="h-7 px-2 text-xs text-[var(--color-muted-foreground)] hover:text-[var(--color-foreground)] gap-1.5"
              >
                <CheckCircle aria-hidden="true" className="size-3" />
                Mark read
              </Button>
            </form>
          )}
          <form action={updateReminder}>
            <input type="hidden" name="id" value={r.id} />
            <input type="hidden" name="action" value="dismiss" />
            <Button
              type="submit"
              variant="ghost"
              className="h-7 px-2 text-xs text-[var(--color-muted-foreground)] hover:text-[var(--color-foreground)]"
            >
              Dismiss
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
