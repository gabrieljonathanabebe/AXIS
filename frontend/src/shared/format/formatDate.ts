import { LOCALE } from '../config'

import type { DateFormat, TimeGrain } from './valueFormats'

// ===== TYPES =================================================================
/** Formats one date value; values that are no date come back as text. */
export type DateFormatter = (value: string | number) => string

// ===== CONSTANTS =============================================================
/** Year, month and day at the start of an ISO text, as written. */
const ISO_DATE_PATTERN = /^(\d{4})-(\d{2})-(\d{2})/

/** Intl options of the auto format per grain; quarters are composed. */
const AUTO_OPTIONS: Record<
  Exclude<TimeGrain, 'quarter'>,
  Intl.DateTimeFormatOptions
> = {
  day: { day: 'numeric', month: 'short', year: 'numeric' },
  week: { day: 'numeric', month: 'short', year: 'numeric' },
  month: { month: 'short', year: 'numeric' },
  year: { year: 'numeric' },
}

/** Standard format of profile and table filters. */
const STANDARD_OPTIONS: Intl.DateTimeFormatOptions = { dateStyle: 'medium' }

const intlFormats = new Map<string, Intl.DateTimeFormat>()

// ===== HELPERS ===============================================================
/**
 * Returns the cached Intl format for a locale and options, always in UTC so
 * the wall-clock date from parseDateValue comes back unchanged.
 * @param locale Locale of the text.
 * @param options Parts of the date to show.
 * @returns The shared Intl.DateTimeFormat instance.
 */
function getIntlFormat(
  locale: string,
  options: Intl.DateTimeFormatOptions,
): Intl.DateTimeFormat {
  const key = `${locale}|${JSON.stringify(options)}`
  let format = intlFormats.get(key)
  if (!format) {
    format = new Intl.DateTimeFormat(locale, { ...options, timeZone: 'UTC' })
    intlFormats.set(key, format)
  }
  return format
}

/**
 * Creates the auto format of a grain, e.g. "Mar 2025" for months.
 * @param grain Time grain the dates are grouped by.
 * @param locale Locale of the text.
 * @returns Formatter for parsed dates.
 */
function createAutoFormatter(
  grain: TimeGrain,
  locale: string,
): (date: Date) => string {
  if (grain === 'quarter') {
    const yearFormat = getIntlFormat(locale, AUTO_OPTIONS.year)
    return (date) => {
      const quarter = Math.floor(date.getUTCMonth() / 3) + 1
      return `Q${quarter} ${yearFormat.format(date)}`
    }
  }
  const format = getIntlFormat(locale, AUTO_OPTIONS[grain])
  return (date) => format.format(date)
}

// ===== FUNCTIONS =============================================================
/**
 * Reads a date value as wall-clock date: year, month and day as written,
 * without converting a time zone; numbers are timestamps.
 * @param value ISO text such as "2025-03-01T00:30:00", or a timestamp.
 * @returns The date at UTC midnight, or null for values that are no date.
 */
export function parseDateValue(value: string | number): Date | null {
  if (typeof value === 'number') {
    const date = new Date(value)
    return Number.isNaN(date.getTime()) ? null : date
  }
  const match = ISO_DATE_PATTERN.exec(value)
  if (!match) {
    return null
  }
  const [year, month, day] = match.slice(1).map(Number)
  const date = new Date(Date.UTC(year, month - 1, day))
  return date.getUTCDate() === day ? date : null
}

/**
 * Creates the formatter of a date format.
 * @param format Date format; auto follows the grain.
 * @param grain Time grain of the dates; without one they show as days.
 * @param locale Locale of the text.
 * @returns Formatter for date values.
 */
export function createDateFormatter(
  format: DateFormat,
  grain: TimeGrain | null,
  locale: string = LOCALE,
): DateFormatter {
  const formatParsed = createParsedFormatter(format, grain ?? 'day', locale)
  return (value) => {
    const date = parseDateValue(value)
    return date ? formatParsed(date) : String(value)
  }
}

/**
 * Formats a date in the standard format of profile and table filters.
 * @param value ISO text or timestamp.
 * @param locale Locale of the text.
 * @returns E.g. "Mar 14, 2025", or the value as text if it is no date.
 */
export function formatDate(
  value: string | number,
  locale: string = LOCALE,
): string {
  const date = parseDateValue(value)
  return date
    ? getIntlFormat(locale, STANDARD_OPTIONS).format(date)
    : String(value)
}

/**
 * Picks the formatter for parsed dates of a date format.
 * @param format Date format.
 * @param grain Time grain of the dates.
 * @param locale Locale of the text.
 * @returns Formatter for parsed dates.
 */
function createParsedFormatter(
  format: DateFormat,
  grain: TimeGrain,
  locale: string,
): (date: Date) => string {
  switch (format.style) {
    case 'auto':
      return createAutoFormatter(grain, locale)
  }
}
