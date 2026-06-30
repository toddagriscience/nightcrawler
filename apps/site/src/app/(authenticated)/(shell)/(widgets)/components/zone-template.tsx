// Copyright © Todd Agriscience, Inc. All rights reserved.

import { analysis } from '@nightcrawler/db/schema';
import { db } from '@nightcrawler/db/schema/connection';
import { desc, eq } from 'drizzle-orm';

/** Months between a soil sample and the next scheduled one. */
const TEST_PERIOD_MONTHS = 6;

/** Placeholder until advisors are modeled in the DB. */
const LEAD_ADVISOR_PLACEHOLDER = 'Not assigned';

/** Shared vertical spacing for each stacked section. */
const SECTION_CLASS = 'py-6';

/** Small uppercase, letter-spaced section label. */
const LABEL_CLASS =
  'text-xs font-medium uppercase tracking-wider text-foreground/40';

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
 * Per-management-zone template. Renders four stacked sections separated by
 * divider lines: zone info, mineral IMPs (placeholder until the analysis
 * tables are wired), client observations (shell only for now), and a search
 * form that submits to the knowledge-base search page.
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
    <div className="divide-foreground/10 mx-auto max-w-4xl divide-y px-6">
      {/* Info */}
      <section className={SECTION_CLASS}>
        <h2 className="text-foreground text-xl font-medium">{zoneName}</h2>
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
      <section className={SECTION_CLASS}>
        <p className={LABEL_CLASS}>Mineral IMPs</p>
        <p className="text-foreground/50 mt-4 text-sm italic">
          Info not currently available
        </p>
      </section>

      {/* Observations — shell only for now */}
      <section className={SECTION_CLASS}>
        <p className={LABEL_CLASS}>Zone observations</p>
        <button
          type="button"
          disabled
          className="border-foreground/20 text-foreground/50 mt-4 w-full rounded-md border border-dashed px-4 py-3 text-left text-sm"
        >
          + Add an observation to {zoneName}
        </button>
      </section>

      {/* Search — submits to the knowledge-base search page */}
      <section className={SECTION_CLASS}>
        <label htmlFor="zone-search" className={LABEL_CLASS}>
          Ask about this zone or search your farm records
        </label>
        <form
          action="/search"
          method="get"
          role="search"
          className="mt-4 flex gap-2"
        >
          <input
            id="zone-search"
            name="q"
            type="search"
            placeholder="e.g. What does this mean for my tomatoes?"
            className="border-foreground/15 text-foreground flex-1 rounded-md border bg-transparent px-3 py-2 text-sm"
          />
          <button
            type="submit"
            className="border-foreground/15 text-foreground hover:bg-foreground/5 rounded-md border px-5 py-2 text-sm"
          >
            Ask
          </button>
        </form>
      </section>
    </div>
  );
}
