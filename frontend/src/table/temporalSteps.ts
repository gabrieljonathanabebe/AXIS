import { parseDateValue } from '../shared/format/formatDate'

import type { TimeGrain } from '../shared/format/valueFormats'

// ===== CONSTANTS =============================================================
const monthsByGrain: Partial<Record<TimeGrain, number>> = {
  month: 1,
  quarter: 3,
  year: 12,
}

// ===== HELPERS ===============================================================
/** ISO date part of a date, e.g. "2025-03-14". */
function toIsoDate(date: Date): string {
  return date.toISOString().slice(0, 10)
}

/** The next step after a date: months for coarse grains, else days. */
function addStep(date: Date, grain: TimeGrain | null): Date {
  const next = new Date(date)
  const months = grain ? monthsByGrain[grain] : undefined
  if (months) {
    next.setUTCMonth(next.getUTCMonth() + months)
  } else {
    next.setUTCDate(next.getUTCDate() + (grain === 'week' ? 7 : 1))
  }
  return next
}

// ===== FUNCTIONS =============================================================
/**
 * ISO dates from min to max in steps of the native grain, read as
 * wall-clock dates; without a grain in days. The last step is max.
 * @param min First date of the field.
 * @param max Last date of the field.
 * @param grain Native time grain of the field.
 * @returns The steps, or none if min or max is no date.
 */
export function createTemporalSteps(
  min: string,
  max: string,
  grain: TimeGrain | null,
): string[] {
  const start = parseDateValue(min)
  const last = parseDateValue(max)
  if (!start || !last) {
    return []
  }
  const end = toIsoDate(last)
  const steps: string[] = []
  for (let date = start; toIsoDate(date) <= end; date = addStep(date, grain)) {
    steps.push(toIsoDate(date))
  }
  return steps.at(-1) === end ? steps : [...steps, end]
}
