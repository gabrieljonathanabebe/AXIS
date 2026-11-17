import { parseDateValue } from '../shared/format/formatDate'

import type { TemporalGranularity } from '../datasets/types'

// ===== CONSTANTS =============================================================
const monthsByGranularity: Partial<Record<TemporalGranularity, number>> = {
  month: 1,
  quarter: 3,
  year: 12,
}

// ===== HELPERS ===============================================================
function toIsoDate(date: Date): string {
  return date.toISOString().slice(0, 10)
}

function addStep(date: Date, granularity: TemporalGranularity | null): Date {
  const next = new Date(date)
  const months = granularity ? monthsByGranularity[granularity] : undefined
  if (months) {
    next.setUTCMonth(next.getUTCMonth() + months)
  } else {
    next.setUTCDate(next.getUTCDate() + (granularity === 'week' ? 7 : 1))
  }
  return next
}

// ===== FUNCTIONS =============================================================
/**
 * ISO dates from min to max in steps of the detected granularity, read as
 * wall-clock dates; without a granularity in days. The last step is max.
 * @param min First date of the field.
 * @param max Last date of the field.
 * @param granularity Detected granularity of the field.
 * @returns The steps, or none if min or max is no date.
 */
export function createTemporalSteps(
  min: string,
  max: string,
  granularity: TemporalGranularity | null,
): string[] {
  const start = parseDateValue(min)
  const last = parseDateValue(max)
  if (!start || !last) {
    return []
  }
  const end = toIsoDate(last)
  const steps: string[] = []
  for (
    let date = start;
    toIsoDate(date) <= end;
    date = addStep(date, granularity)
  ) {
    steps.push(toIsoDate(date))
  }
  return steps.at(-1) === end ? steps : [...steps, end]
}
