import type { NumberStyle } from './formatNumber'

// ===== TYPES =================================================================
export type CurrencyCode = 'EUR' | 'USD' | 'GBP' | 'JPY'

/** How a number is shown; auto lets the place that shows it decide. */
export type ValueFormat = 'auto' | NumberStyle

// ===== CONSTANTS =============================================================
/** Number formats a value can be shown in, as select options. */
export const VALUE_FORMAT_OPTIONS = [
  { label: 'Auto', value: 'auto' },
  { label: 'Number', value: 'number' },
  { label: 'Percent', value: 'percent' },
  { label: 'Currency', value: 'currency' },
] satisfies { label: string; value: ValueFormat }[]

/** Currencies of the currency format, as select options. */
export const CURRENCY_OPTIONS = [
  { label: 'EUR', value: 'EUR' },
  { label: 'USD', value: 'USD' },
  { label: 'GBP', value: 'GBP' },
  { label: 'JPY', value: 'JPY' },
] satisfies { label: string; value: CurrencyCode }[]
