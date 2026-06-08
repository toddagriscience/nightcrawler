// Copyright © Todd Agriscience, Inc. All rights reserved.

/**
 * Parses a seasonal label string into a Date.
 *
 * Supports patterns:
 * - "mid [month]" → [month] 15 (e.g., "mid March" → March 15)
 * - "early [month/season]" → [month/season] 1
 * - "late [month/season]" → [month/season] 15 (or last day - 7 for months)
 * - "[N] months from now" → referenceDate + N months
 * - "when soil warms up" → April 15 (conservative guess)
 * - "end of season" → last day of current growing season (Dec 31)
 *
 * @param label - The seasonal label string
 * @param referenceDate - Date to base relative calculations on (default: now)
 * @returns Parsed Date or null if unparseable
 */
export function parseSeasonalLabel(
  label: string,
  referenceDate: Date = new Date()
): Date | null {
  if (!label || typeof label !== 'string') {
    return null;
  }

  const normalized = label.trim().toLowerCase();

  // Month name mappings
  const monthMap: Record<string, number> = {
    january: 0,
    jan: 0,
    february: 1,
    feb: 1,
    march: 2,
    mar: 2,
    april: 3,
    apr: 3,
    may: 4,
    june: 5,
    jun: 5,
    july: 6,
    jul: 6,
    august: 7,
    aug: 7,
    september: 8,
    sep: 8,
    sept: 8,
    october: 9,
    oct: 9,
    november: 10,
    nov: 10,
    december: 11,
    dec: 11,
  };

  // Season to approximate month mappings
  const seasonMap: Record<string, number> = {
    spring: 3, // March 1
    summer: 6, // June 1
    fall: 9, // September 1
    autumn: 9,
    winter: 12, // December 1
  };

  // Helper to get the next occurrence of a month after referenceDate
  const getNextMonthOccurrence = (month: number, day: number): Date => {
    const thisYear = referenceDate.getFullYear();
    const thisMonth = referenceDate.getMonth();

    let year = thisYear;
    let targetMonth = month;

    if (
      month < thisMonth ||
      (month === thisMonth && referenceDate.getDate() > day)
    ) {
      year = thisYear + 1;
    }

    const date = new Date(year, month, day);
    return date;
  };

  // Pattern: "mid [month]" or "mid-[month]"
  const midMonthMatch = normalized.match(
    /^mid\s+(jan(?:uary)?|feb(?:ruary)?|mar(?:ch)?|apr(?:il)?|may|june?|july?|aug(?:ust)?|sep(?:tember)?|oct(?:ober)?|nov(?:ember)?|dec(?:ember)?)$/i
  );
  if (midMonthMatch) {
    const monthKey = midMonthMatch[1].toLowerCase().slice(0, 3);
    const month = monthMap[monthKey];
    if (month !== undefined) {
      return getNextMonthOccurrence(month, 15);
    }
  }

  // Pattern: "early [month/season]" or "early-[month/season]"
  const earlyMatch = normalized.match(
    /^early\s+(jan(?:uary)?|feb(?:ruary)?|mar(?:ch)?|apr(?:il)?|may|june?|july?|aug(?:ust)?|sep(?:tember)?|oct(?:ober)?|nov(?:ember)?|dec(?:ember)?|spring|summer|fall|autumn|winter)$/i
  );
  if (earlyMatch) {
    const target = earlyMatch[1].toLowerCase();
    const month = monthMap[target] ?? seasonMap[target];
    if (month !== undefined) {
      return getNextMonthOccurrence(month, 1);
    }
  }

  // Pattern: "late [month/season]" or "late-[month/season]"
  const lateMatch = normalized.match(
    /^late\s+(jan(?:uary)?|feb(?:ruary)?|mar(?:ch)?|apr(?:il)?|may|june?|july?|aug(?:ust)?|sep(?:tember)?|oct(?:ober)?|nov(?:ember)?|dec(?:ember)?|spring|summer|fall|autumn|winter)$/i
  );
  if (lateMatch) {
    const target = lateMatch[1].toLowerCase();
    const month = monthMap[target] ?? seasonMap[target];
    if (month !== undefined) {
      // Late = 15th for months, or last - 7 for seasons
      const isSeason = seasonMap[target] !== undefined;
      const day = isSeason ? 22 : 15;
      return getNextMonthOccurrence(month, day);
    }
  }

  // Pattern: "[N] months from now"
  const monthsFromNowMatch = normalized.match(
    /^(\d+)\s+months?\s+from\s+now$/i
  );
  if (monthsFromNowMatch) {
    const months = parseInt(monthsFromNowMatch[1], 10);
    const result = new Date(referenceDate);
    result.setMonth(result.getMonth() + months);
    return result;
  }

  // Pattern: "when soil warms up" → April 15
  if (normalized.includes('soil') && normalized.includes('warm')) {
    return getNextMonthOccurrence(3, 15); // April 15
  }

  // Pattern: "end of season" → December 31
  if (normalized.includes('end') && normalized.includes('season')) {
    const thisYear = referenceDate.getFullYear();
    return new Date(thisYear, 11, 31); // December 31
  }

  // Pattern: "end of [month]" → last day of that month
  const endOfMonthMatch = normalized.match(
    /^end\s+of\s+(jan(?:uary)?|feb(?:ruary)?|mar(?:ch)?|apr(?:il)?|may|june?|july?|aug(?:ust)?|sep(?:tember)?|oct(?:ober)?|nov(?:ember)?|dec(?:ember)?)$/i
  );
  if (endOfMonthMatch) {
    const monthKey = endOfMonthMatch[1].toLowerCase().slice(0, 3);
    const month = monthMap[monthKey];
    if (month !== undefined) {
      const year =
        referenceDate.getMonth() <= month
          ? referenceDate.getFullYear()
          : referenceDate.getFullYear() + 1;
      const lastDay = new Date(year, month + 1, 0).getDate();
      return new Date(year, month, lastDay);
    }
  }

  // Pattern: "first week of [month]" → 7th of that month
  const firstWeekMatch = normalized.match(
    /^first\s+week\s+of\s+(jan(?:uary)?|feb(?:ruary)?|mar(?:ch)?|apr(?:il)?|may|june?|july?|aug(?:ust)?|sep(?:tember)?|oct(?:ober)?|nov(?:ember)?|dec(?:ember)?)$/i
  );
  if (firstWeekMatch) {
    const monthKey = firstWeekMatch[1].toLowerCase().slice(0, 3);
    const month = monthMap[monthKey];
    if (month !== undefined) {
      return getNextMonthOccurrence(month, 7);
    }
  }

  // Pattern: "second week of [month]" → 14th of that month
  const secondWeekMatch = normalized.match(
    /^second\s+week\s+of\s+(jan(?:uary)?|feb(?:ruary)?|mar(?:ch)?|apr(?:il)?|may|june?|july?|aug(?:ust)?|sep(?:tember)?|oct(?:ober)?|nov(?:ember)?|dec(?:ember)?)$/i
  );
  if (secondWeekMatch) {
    const monthKey = secondWeekMatch[1].toLowerCase().slice(0, 3);
    const month = monthMap[monthKey];
    if (month !== undefined) {
      return getNextMonthOccurrence(month, 14);
    }
  }

  return null;
}
