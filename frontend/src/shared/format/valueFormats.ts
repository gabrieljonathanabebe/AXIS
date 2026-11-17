import type { NumberStyle } from './formatNumber'

// ===== TYPES =================================================================
export type CurrencyCode = 'EUR' | 'USD' | 'GBP' | 'JPY'

/** How a date is shown; auto follows the time grain of the data. */
export type DateFormat = { style: 'auto' }

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
