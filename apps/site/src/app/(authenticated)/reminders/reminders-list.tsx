// Copyright © Todd Agriscience, Inc. All rights reserved.

'use client';

import { useState } from 'react';
import { ReminderCard } from './reminder-card';
import { ReminderEditSheet } from './reminder-edit-sheet';
import type { Reminder } from './types';
import { parseSeasonalLabel } from './parse-seasonal';

function isWithinDays(date: Date, days: number): boolean {
  const now = new Date();
  const future = new Date(now);
  future.setDate(future.getDate() + days);
  return date >= now && date <= future;
}

function groupReminders(reminders: Reminder[]): {
  upcoming: Reminder[];
  later: Reminder[];
} {
  const upcoming: Reminder[] = [];
  const later: Reminder[] = [];

  for (const r of reminders) {
    let effectiveDate: Date | null = null;

    if (r.dueDate) {
      effectiveDate = new Date(r.dueDate);
    } else if (r.seasonalLabel) {
      effectiveDate = parseSeasonalLabel(r.seasonalLabel);
    }

    if (effectiveDate && isWithinDays(effectiveDate, 90)) {
      upcoming.push(r);
    } else {
      later.push(r);
    }
  }

  upcoming.sort((a, b) => {
    const dateA = a.dueDate
      ? new Date(a.dueDate)
      : (parseSeasonalLabel(a.seasonalLabel!) ?? new Date(9999, 11, 31));
    const dateB = b.dueDate
      ? new Date(b.dueDate)
      : (parseSeasonalLabel(b.seasonalLabel!) ?? new Date(9999, 11, 31));
    return dateA.getTime() - dateB.getTime();
  });

  return { upcoming, later };
}

function SectionHeader({ title, count }: { title: string; count: number }) {
  return (
    <div className="flex items-center gap-2 mb-3">
      <h2 className="text-sm font-semibold text-[var(--color-foreground)]">
        {title}
      </h2>
      <span className="text-xs text-[var(--color-muted-foreground)] bg-[var(--color-background)]/50 px-2 py-0.5 rounded-full">
        {count}
      </span>
    </div>
  );
}

interface RemindersListProps {
  reminders: Reminder[];
}

export function RemindersList({ reminders }: RemindersListProps) {
  const [editingReminder, setEditingReminder] = useState<Reminder | null>(null);
  const [editSheetOpen, setEditSheetOpen] = useState(false);

  const { upcoming, later } = groupReminders(reminders);

  const handleEdit = (reminder: Reminder) => {
    setEditingReminder(reminder);
    setEditSheetOpen(true);
  };

  if (reminders.length === 0) {
    return (
      <div
        role="status"
        aria-live="polite"
        className="py-16 text-center rounded-xl bg-[var(--color-background)]/30 border border-[var(--color-border)]/50"
      >
        <svg
          aria-hidden="true"
          className="size-10 mx-auto text-[var(--color-success)] mb-4 opacity-70"
          fill="none"
          stroke="currentColor"
          strokeWidth={1.5}
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
        <p className="text-base font-medium text-[var(--color-foreground)]">
          {"You're all caught up."}
        </p>
        <p className="text-sm text-[var(--color-muted-foreground)] mt-2 leading-relaxed">
          Nothing requires your attention right now.
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="space-y-8">
        {upcoming.length > 0 && (
          <section>
            <SectionHeader title="Upcoming" count={upcoming.length} />
            <div className="rounded-xl bg-[var(--color-surface)]/40 border border-[var(--color-border)]/60 overflow-hidden">
              {upcoming.map((r) => (
                <ReminderCard key={r.id} reminder={r} onEdit={handleEdit} />
              ))}
            </div>
          </section>
        )}

        {later.length > 0 && (
          <section>
            <SectionHeader title="Later" count={later.length} />
            <div className="rounded-xl bg-[var(--color-surface)]/40 border border-[var(--color-border)]/60 overflow-hidden">
              {later.map((r) => (
                <ReminderCard key={r.id} reminder={r} onEdit={handleEdit} />
              ))}
            </div>
          </section>
        )}
      </div>

      {editingReminder && (
        <ReminderEditSheet
          reminder={editingReminder}
          open={editSheetOpen}
          onOpenChange={(open) => {
            setEditSheetOpen(open);
            if (!open) {
              setEditingReminder(null);
            }
          }}
        />
      )}
    </>
  );
}
