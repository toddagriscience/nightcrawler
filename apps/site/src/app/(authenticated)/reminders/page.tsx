// Copyright © Todd Agriscience, Inc. All rights reserved.

import type { Metadata } from 'next';
import { getReminders } from './db';
import { Bell, CheckCircle, AlertTriangle, Clock } from 'lucide-react';
import { updateReminder } from './actions';
import { Button } from '@/components/ui/button';
import type { Reminder } from './types';

export const metadata: Metadata = {
  title: { default: 'Reminders | Todd', template: '%s | Todd' },
};

const typeIcons = {
  system: Bell,
  deadline: Clock,
  alert: AlertTriangle,
};

const typeColors = {
  system: 'text-[var(--color-foreground)]',
  deadline: 'text-[var(--color-warning)]',
  alert: 'text-[var(--color-alert)]',
};

/**
 * Renders a single reminder item with icon, title, body, and action buttons.
 */
function ReminderItem({ reminder: r }: { reminder: Reminder }) {
  const Icon = typeIcons[r.type];

  return (
    <div className="group relative flex gap-4 px-4 py-5 rounded-lg hover:bg-[var(--color-background)]/50 transition-colors duration-200">
      <Icon
        aria-hidden="true"
        className={`size-5 mt-0.5 shrink-0 ${typeColors[r.type]}`}
      />
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
        <p className="text-sm text-[var(--color-muted-foreground)] mt-1 line-clamp-2 leading-relaxed">
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

/**
 * Reminders page displaying system notifications with mark-read and dismiss actions.
 */
export default async function RemindersPage() {
  const reminders = await getReminders();

  return (
    <div className="max-w-2xl">
      <h1 className="text-2xl font-bold text-[var(--color-foreground)] mb-6">
        Reminders
      </h1>

      {reminders.length === 0 ? (
        <div
          role="status"
          aria-live="polite"
          className="py-16 text-center rounded-xl bg-[var(--color-background)]/30 border border-[var(--color-border)]/50"
        >
          <CheckCircle
            aria-hidden="true"
            className="size-10 mx-auto text-[var(--color-success)] mb-4 opacity-70"
          />
          <p className="text-base font-medium text-[var(--color-foreground)]">
            {"You're all caught up."}
          </p>
          <p className="text-sm text-[var(--color-muted-foreground)] mt-2 leading-relaxed">
            Nothing requires your attention right now.
          </p>
        </div>
      ) : (
        <div className="rounded-xl bg-[var(--color-surface)]/40 border border-[var(--color-border)]/60 overflow-hidden">
          {reminders.map((r) => (
            <ReminderItem key={r.id} reminder={r} />
          ))}
        </div>
      )}
    </div>
  );
}
