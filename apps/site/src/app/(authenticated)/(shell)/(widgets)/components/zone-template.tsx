// Copyright © Todd Agriscience, Inc. All rights reserved.

import { analysis } from '@nightcrawler/db/schema';
import { db } from '@nightcrawler/db/schema/connection';
import { desc, eq } from 'drizzle-orm';

/** Months between a soil sample and the next scheduled one. */
const TEST_PERIOD_MONTHS = 6;

/** Placeholder until advisors are modeled in the DB. */
const LEAD_ADVISOR_PLACEHOLDER = 'Not assigned';

const CARD_CLASS = 'rounded-xl border border-stone-200 p-6';

function addMonths(date: Date, months: number): Date {
  const next = new Date(date);
  next.setMonth(next.getMonth() + months);
  return next;
}

function formatDate(date: Date | null): string {
  if (!date) return '—';
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

/**
 * Per-management-zone template. Renders four stacked cards: zone info, mineral
 * IMPs (placeholder until the analysis tables are wired), client observations
 * (shell only for now), and search.
 *
 * @param {object} props - Component props.
 * @param {number} props.zoneId - Selected management zone id.
 * @param {string} props.zoneName - Selected management zone name.
 * @returns {Promise<React.ReactNode>} The rendered zone template.
 */
export default async function ZoneTemplate({
  zoneId,
  zoneName,
}: {
  zoneId: number;
  zoneName: string;
}) {
  const [latest] = await db
    .select({ analysisDate: analysis.analysisDate })
    .from(analysis)
    .where(eq(analysis.managementZone, zoneId))
    .orderBy(desc(analysis.analysisDate))
    .limit(1);

  const sampleDate = latest?.analysisDate ?? null;
  const nextDate = sampleDate
    ? addMonths(sampleDate, TEST_PERIOD_MONTHS)
    : null;

  return (
    <div className="mx-auto flex max-w-4xl flex-col gap-6 p-6">
      {/* Info */}
      <section className={CARD_CLASS}>
        <h2 className="text-xl font-medium text-foreground">{zoneName}</h2>
        <div className="mt-4 flex flex-wrap gap-x-12 gap-y-3 text-sm">
          <div>
            <span className="text-foreground/50">Sample </span>
            <span className="text-foreground">{formatDate(sampleDate)}</span>
          </div>
          <div>
            <span className="text-foreground/50">Next </span>
            <span className="text-foreground">{formatDate(nextDate)}</span>
          </div>
          <div>
            <span className="text-foreground/50">Lead Advisor </span>
            <span className="text-foreground">{LEAD_ADVISOR_PLACEHOLDER}</span>
          </div>
        </div>
      </section>

      {/* Mineral IMPs — placeholder until analysis tables are wired */}
      <section className={CARD_CLASS}>
        <p className="text-sm italic text-foreground/50">
          Info not currently available
        </p>
      </section>

      {/* Observations — shell only for now */}
      <section className={CARD_CLASS}>
        <h3 className="text-foreground">Observations</h3>
        <button
          type="button"
          disabled
          className="mt-4 text-sm text-foreground/50"
        >
          + Add an observation to {zoneName}
        </button>
      </section>

      {/* Search */}
      <section className={CARD_CLASS}>
        <label htmlFor="zone-search" className="text-foreground">
          Search
        </label>
        <input
          id="zone-search"
          type="search"
          disabled
          placeholder="Search…"
          className="mt-4 w-full rounded-md border border-stone-200 bg-stone-50 px-3 py-2 text-sm"
        />
      </section>
    </div>
  );
}
