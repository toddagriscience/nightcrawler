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
  system: 'text-foreground',
  deadline: 'text-[var(--color-warning)]',
  alert: 'text-[var(--color-alert)]',
};

/**
 * Renders a single reminder item with icon, title, body, and action buttons.
 */
function ReminderItem({ reminder: r }: { reminder: Reminder }) {
  const Icon = typeIcons[r.type];

  return (
    <div className="flex gap-3 py-4 border-b border-[var(--border)] last:border-b-0">
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
            className="text-sm font-medium text-foreground hover:underline"
          >
            {r.title}
          </a>
        ) : (
          <p className="text-sm font-medium text-foreground">{r.title}</p>
        )}
        <p className="text-sm text-muted-foreground mt-0.5 line-clamp-2">
          {r.body}
        </p>
        <div className="flex items-center gap-2 mt-2">
          {!r.read && (
            <form action={updateReminder}>
              <input type="hidden" name="id" value={r.id} />
              <input type="hidden" name="action" value="mark_read" />
              <Button
                type="submit"
                variant="ghost"
                className="h-7 px-2 text-xs text-muted-foreground hover:text-foreground"
              >
                <CheckCircle aria-hidden="true" className="size-3 mr-1" />
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
              className="h-7 px-2 text-xs text-muted-foreground hover:text-foreground"
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
      <h1 className="text-2xl font-bold text-foreground mb-6">Reminders</h1>

      {reminders.length === 0 ? (
        <div role="status" aria-live="polite" className="py-16 text-center">
          <Bell
            aria-hidden="true"
            className="size-8 mx-auto text-muted-foreground/40 mb-3"
          />
          <p className="text-foreground font-medium">
            {"You're all caught up."}
          </p>
          <p className="text-sm text-muted-foreground mt-1">
            System notifications will appear here.
          </p>
        </div>
      ) : (
        <div className="divide-y divide-[var(--border)]">
          {reminders.map((r) => (
            <ReminderItem key={r.id} reminder={r} />
          ))}
        </div>
      )}
    </div>
  );
}
