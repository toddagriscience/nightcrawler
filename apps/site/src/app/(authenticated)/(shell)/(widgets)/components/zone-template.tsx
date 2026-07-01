// Copyright © Todd Agriscience, Inc. All rights reserved.

import { analysis } from '@nightcrawler/db/schema';
import { db } from '@nightcrawler/db/schema/connection';
import { desc, eq } from 'drizzle-orm';
import { ZoneSearchForm } from './zone-search-form';

/** Months between a soil sample and the next scheduled one. */
const TEST_PERIOD_MONTHS = 6;

/** Placeholder until advisors are modeled in the DB. */
const LEAD_ADVISOR_PLACEHOLDER = 'Not assigned';

/** Shared vertical spacing for each stacked section. */
const SECTION_CLASS = 'py-6';

const HEADING_CLASS = 'text-sm font-medium text-foreground';

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
 * Per-management-zone template. Renders stacked sections separated by divider
 * lines: zone info, mineral IMPs placeholder, client observations (shell only
 * for now), and a search form that opens the inference search panel.
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

      {/* Mineral IMPs placeholder until analysis tables are wired */}
      <section className={SECTION_CLASS}>
        <p className="text-foreground/60 text-sm">
          Information temporarily not available
        </p>
      </section>

      {/* Observations — shell only for now */}
      <section className={SECTION_CLASS}>
        <p className={HEADING_CLASS}>Observations</p>
        <button
          type="button"
          disabled
          className="border-foreground/20 text-foreground/50 mt-4 w-full rounded-md border border-dashed px-4 py-3 text-left text-sm"
        >
          + Add an observation to {zoneName}
        </button>
      </section>

      {/* Search — opens the right-side search panel seeded with the query */}
      <section className={SECTION_CLASS}>
        <label htmlFor="zone-search" className={HEADING_CLASS}>
          Ask about this zone
        </label>
        <ZoneSearchForm />
      </section>
    </div>
  );
}
