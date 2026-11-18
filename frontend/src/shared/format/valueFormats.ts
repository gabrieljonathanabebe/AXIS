import type { NumberStyle } from './formatNumber'

// ===== TYPES =================================================================
export type CurrencyCode = 'EUR' | 'USD' | 'GBP' | 'JPY'

/**
 * How a date is shown: auto follows the time grain, a preset is one of the
 * examples of its grain; a preset that does not fit the grain falls back
 * to auto.
 */
export type DateFormat =
  { style: 'auto' } | { style: 'preset'; preset: DatePreset }

/** Examples a date format can follow, grouped by the grain they fit. */
export type DatePreset =
  | 'day-medium'
  | 'day-numeric'
  | 'day-iso'
  | 'day-weekday'
  | 'week-start'
  | 'week-number'
  | 'month-short'
  | 'month-long'
  | 'month-numeric'
  | 'month-iso'
  | 'quarter'
  | 'quarter-short'
  | 'year'
  | 'year-short'

/**
 * How a number is shown: style, currency, fraction digits, compact notation
 * and text around it. Without decimals the style decides how many show.
 */
export type NumberFormat = {
  compact: boolean
  currency: CurrencyCode
  decimals: number | null
  prefix: string
  style: ValueFormat
  suffix: string
}

/** Step in which dates are grouped, from the finest to the coarsest. */
export type TimeGrain = 'day' | 'week' | 'month' | 'quarter' | 'year'

/** How a number is shown; auto lets the place that shows it decide. */
export type ValueFormat = 'auto' | NumberStyle

// ===== CONSTANTS =============================================================
/** Presets that fit each grain; the first is the auto preset of the grain. */
export const DATE_PRESETS_BY_GRAIN: Record<TimeGrain, DatePreset[]> = {
  day: ['day-medium', 'day-numeric', 'day-iso', 'day-weekday'],
  week: ['week-start', 'week-number'],
  month: ['month-short', 'month-long', 'month-numeric', 'month-iso'],
  quarter: ['quarter', 'quarter-short'],
  year: ['year', 'year-short'],
}

/** Date format of a new element: follows the time grain. */
export const DEFAULT_DATE_FORMAT: DateFormat = { style: 'auto' }

/** Format of a new element: auto style, no fixed decimals, no extra text. */
export const DEFAULT_NUMBER_FORMAT: NumberFormat = {
  compact: false,
  currency: 'EUR',
  decimals: null,
  prefix: '',
  style: 'auto',
  suffix: '',
}

/** Currencies of the currency format with their symbol, as options. */
export const CURRENCY_OPTIONS = [
  { label: '€ EUR', value: 'EUR' },
  { label: '$ USD', value: 'USD' },
  { label: '£ GBP', value: 'GBP' },
  { label: '¥ JPY', value: 'JPY' },
] satisfies { label: string; value: CurrencyCode }[]

/** Time grains from the finest to the coarsest, as options. */
export const TIME_GRAIN_OPTIONS = [
  { label: 'Day', value: 'day' },
  { label: 'Week', value: 'week' },
  { label: 'Month', value: 'month' },
  { label: 'Quarter', value: 'quarter' },
  { label: 'Year', value: 'year' },
] satisfies { label: string; value: TimeGrain }[]
