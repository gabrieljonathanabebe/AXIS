import type { TemporalGranularity } from '../types/chart'

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
// ISO dates from min to max in steps of the detected granularity (UTC,
// like formatDate); without a granularity in days. The last step is max.
export function createTemporalSteps(
  min: string,
  max: string,
  granularity: TemporalGranularity | null,
): string[] {
  const end = toIsoDate(new Date(max))
  const steps: string[] = []
  for (
    let date = new Date(min);
    toIsoDate(date) <= end;
    date = addStep(date, granularity)
  ) {
    steps.push(toIsoDate(date))
  }
  return steps.at(-1) === end ? steps : [...steps, end]
}
