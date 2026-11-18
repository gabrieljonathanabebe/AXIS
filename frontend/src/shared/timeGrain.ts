import { parseDateValue } from './format/formatDate'

import type { TimeGrain } from './format/valueFormats'

// ===== CONSTANTS =============================================================
const MONTHS_BY_GRAIN: Partial<Record<TimeGrain, number>> = {
  month: 1,
  quarter: 3,
  year: 12,
}

// ===== FUNCTIONS =============================================================
/** ISO date part of a date, e.g. "2025-03-14". */
export function toIsoDate(date: Date): string {
  return date.toISOString().slice(0, 10)
}

/**
 * The date one grain later: months for coarse grains, else days.
 * @param date Start date in UTC, as read by parseDateValue.
 * @param grain Time grain; without one a day.
 * @returns A new date.
 */
export function addTimeGrain(date: Date, grain: TimeGrain | null): Date {
  const next = new Date(date)
  const months = grain ? MONTHS_BY_GRAIN[grain] : undefined
  if (months) {
    next.setUTCMonth(next.getUTCMonth() + months)
  } else {
    next.setUTCDate(next.getUTCDate() + (grain === 'week' ? 7 : 1))
  }
  return next
}

/**
 * Last day of the period that starts at a date, e.g. "2025-03-31" for the
 * month from "2025-03-01".
 * @param start First day of the period, as ISO text.
 * @param grain Time grain of the period.
 * @returns The last day as ISO date, or null if start is no date.
 */
export function getPeriodEnd(start: string, grain: TimeGrain): string | null {
  const date = parseDateValue(start)
  if (!date) {
    return null
  }
  const next = addTimeGrain(date, grain)
  next.setUTCDate(next.getUTCDate() - 1)
  return toIsoDate(next)
}
