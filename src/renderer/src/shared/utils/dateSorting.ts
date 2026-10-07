import { ChronologicalItem, SortOptions } from '../types/sorting';

const ONGOING_REGEX = /^(currently|present|actual|actualmente|hoy)$/i;

/**
 * Checks whether an entry is considered currently ongoing.
 */
export function isOngoingDate(endDate?: string | null, startDate?: string | null): boolean {
  const hasStart = Boolean(startDate && startDate.trim().length > 0);
  if (!hasStart) return false;

  if (endDate === null || endDate === undefined) return true;
  const trimmedEnd = endDate.trim();
  if (trimmedEnd.length === 0) return true;

  return ONGOING_REGEX.test(trimmedEnd);
}

/**
 * Safely parses standard ISO, YYYY-MM-DD, YYYY-MM, or YYYY date strings into millisecond timestamps.
 */
export function parseDateValue(dateStr?: string | null): number | null {
  if (!dateStr) return null;
  const clean = dateStr.trim();
  if (!clean || ONGOING_REGEX.test(clean)) return null;

  // Year only: YYYY
  if (/^\d{4}$/.test(clean)) {
    const ts = Date.parse(`${clean}-01-01T00:00:00.000Z`);
    return isNaN(ts) ? null : ts;
  }

  // Year and Month: YYYY-MM
  if (/^\d{4}-\d{1,2}$/.test(clean)) {
    const parts = clean.split('-');
    const month = parts[1].padStart(2, '0');
    const ts = Date.parse(`${parts[0]}-${month}-01T00:00:00.000Z`);
    return isNaN(ts) ? null : ts;
  }

  // Standard or ISO Date string
  const ts = Date.parse(clean);
  return isNaN(ts) ? null : ts;
}

/**
 * Universal date comparator sorting entries in descending chronological order (newest first).
 * Prioritizes ongoing/present roles, followed by newest end dates, and breaks ties with start dates.
 */
export function compareDatesDescending<T extends ChronologicalItem>(
  a: T,
  b: T,
  options?: SortOptions
): number {
  const treatCurrent = options?.treatEmptyEndDateAsCurrent !== false;

  const isOngoingA = treatCurrent && isOngoingDate(a.endDate, a.startDate);
  const isOngoingB = treatCurrent && isOngoingDate(b.endDate, b.startDate);

  // 1. Handle Ongoing Roles
  if (isOngoingA && isOngoingB) {
    const startA = parseDateValue(a.startDate);
    const startB = parseDateValue(b.startDate);
    if (startA !== null && startB !== null) return startB - startA;
    if (startA !== null) return -1;
    if (startB !== null) return 1;
    return 0;
  }
  if (isOngoingA && !isOngoingB) return -1;
  if (!isOngoingA && isOngoingB) return 1;

  // 2. Resolve Primary End/Single Date
  const endA = parseDateValue(a.endDate) ?? parseDateValue(a.date) ?? parseDateValue(a.updated_at);
  const endB = parseDateValue(b.endDate) ?? parseDateValue(b.date) ?? parseDateValue(b.updated_at);

  if (endA !== null && endB !== null) {
    if (endA !== endB) {
      return endB - endA;
    }
    // Tie-break with start date
    const startA = parseDateValue(a.startDate);
    const startB = parseDateValue(b.startDate);
    if (startA !== null && startB !== null) return startB - startA;
    if (startA !== null) return -1;
    if (startB !== null) return 1;
    return 0;
  }

  // If one has end date and the other only has start date
  const effectiveA = endA ?? parseDateValue(a.startDate);
  const effectiveB = endB ?? parseDateValue(b.startDate);

  if (effectiveA !== null && effectiveB !== null) {
    return effectiveB - effectiveA;
  }

  if (effectiveA !== null && effectiveB === null) return -1;
  if (effectiveA === null && effectiveB !== null) return 1;

  return 0;
}

/**
 * Returns a new array sorted from newest to oldest without mutating input array.
 */
export function sortChronologicalDescending<T extends ChronologicalItem>(
  items: T[] | undefined | null,
  options?: SortOptions
): T[] {
  if (!items || !Array.isArray(items)) return [];
  return [...items].sort((a, b) => compareDatesDescending(a, b, options));
}
