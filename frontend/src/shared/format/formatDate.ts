import { LOCALE } from '@/shared/config'
import { DATE_PRESETS_BY_GRAIN } from './valueFormats'

import type { DateFormat, DatePreset, TimeGrain } from './valueFormats'

// ===== TYPES =================================================================
/** Formats one date value; values that are no date come back as text. */
export type DateFormatter = (value: string | number) => string

/** How a preset is written: Intl options, or composed from the date. */
type PresetFormat = Intl.DateTimeFormatOptions | ((date: Date) => string)

// ===== CONSTANTS =============================================================
/** Year, month and day at the start of an ISO text, as written. */
const ISO_DATE_PATTERN = /^(\d{4})-(\d{2})-(\d{2})/

const DAY_MS = 86_400_000

/** Standard format of profile and table filters. */
const STANDARD_OPTIONS: Intl.DateTimeFormatOptions = { dateStyle: 'medium' }

/** How each preset is written; Intl orders the parts by locale. */
const PRESET_FORMATS: Record<DatePreset, PresetFormat> = {
  'day-medium': { day: 'numeric', month: 'short', year: 'numeric' },
  'day-numeric': { day: '2-digit', month: '2-digit', year: 'numeric' },
  'day-iso': (date) => date.toISOString().slice(0, 10),
  'day-weekday': { day: 'numeric', month: 'short', weekday: 'short' },
  'week-start': { day: 'numeric', month: 'short', year: 'numeric' },
  'week-number': formatIsoWeek,
  'month-short': { month: 'short', year: 'numeric' },
  'month-long': { month: 'long', year: 'numeric' },
  'month-numeric': { month: '2-digit', year: 'numeric' },
  'month-iso': (date) => date.toISOString().slice(0, 7),
  quarter: (date) => `Q${getQuarter(date)} ${date.getUTCFullYear()}`,
  'quarter-short': (date) => `Q${getQuarter(date)} ${formatShortYear(date)}`,
  year: { year: 'numeric' },
  'year-short': formatShortYear,
}

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

/** Quarter of a date, 1 to 4. */
function getQuarter(date: Date): number {
  return Math.floor(date.getUTCMonth() / 3) + 1
}

/** Year with two digits after an apostrophe, e.g. "'25". */
function formatShortYear(date: Date): string {
  return `'${String(date.getUTCFullYear() % 100).padStart(2, '0')}`
}

/**
 * ISO week of a date: weeks start on Monday, and week 1 holds the first
 * Thursday of its year, so late December can belong to the next year.
 * @param date Date in UTC.
 * @returns E.g. "W11 2025", or "W1 2025" for Monday, Dec 30, 2024.
 */
function formatIsoWeek(date: Date): string {
  const weekday = (date.getUTCDay() + 6) % 7
  const thursday = new Date(date.getTime() + (3 - weekday) * DAY_MS)
  const year = thursday.getUTCFullYear()
  const days = (thursday.getTime() - Date.UTC(year, 0, 1)) / DAY_MS
  return `W${Math.floor(days / 7) + 1} ${year}`
}

/**
 * Creates the formatter of a preset for parsed dates.
 * @param preset Preset to write.
 * @param locale Locale of the text.
 * @returns Formatter for parsed dates.
 */
function createPresetFormatter(
  preset: DatePreset,
  locale: string,
): (date: Date) => string {
  const format = PRESET_FORMATS[preset]
  if (typeof format === 'function') {
    return format
  }
  const intlFormat = getIntlFormat(locale, format)
  return (date) => intlFormat.format(date)
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
 * Preset a date format shows for a grain: its own preset if it fits the
 * grain, else the auto preset of the grain.
 * @param format Date format of the element.
 * @param grain Time grain of the dates; without one they show as days.
 * @returns The preset that is written.
 */
export function resolveDatePreset(
  format: DateFormat,
  grain: TimeGrain | null,
): DatePreset {
  const presets = DATE_PRESETS_BY_GRAIN[grain ?? 'day']
  return format.style === 'preset' && presets.includes(format.preset)
    ? format.preset
    : presets[0]
}

/**
 * Creates the formatter of a date format.
 * @param format Date format; auto and unfitting presets follow the grain.
 * @param grain Time grain of the dates; without one they show as days.
 * @param locale Locale of the text.
 * @returns Formatter for date values.
 */
export function createDateFormatter(
  format: DateFormat,
  grain: TimeGrain | null,
  locale: string = LOCALE,
): DateFormatter {
  const formatParsed = createPresetFormatter(
    resolveDatePreset(format, grain),
    locale,
  )
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
