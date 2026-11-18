import { parseDateValue } from '../shared/format/formatDate'
import { addTimeGrain, toIsoDate } from '../shared/timeGrain'

import type { TimeGrain } from '../shared/format/valueFormats'

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
  for (
    let date = start;
    toIsoDate(date) <= end;
    date = addTimeGrain(date, grain)
  ) {
    steps.push(toIsoDate(date))
  }
  return steps.at(-1) === end ? steps : [...steps, end]
}
