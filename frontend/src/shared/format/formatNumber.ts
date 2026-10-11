import { LOCALE } from '../config'

// ===== TYPES =================================================================
export type NumberFormatter = (value: number) => string

export type NumberStyle = 'number' | 'percent' | 'currency'

// ===== CONSTANTS =============================================================
const compactNumberFormat = new Intl.NumberFormat(LOCALE, {
  notation: 'compact',
})

const numberFormat = new Intl.NumberFormat(LOCALE, {
  maximumFractionDigits: 2,
})

const percentFormat = new Intl.NumberFormat(LOCALE, {
  maximumFractionDigits: 1,
  style: 'percent',
})

// ===== FUNCTIONS =============================================================
export function formatCompactNumber(value: number): string {
  return compactNumberFormat.format(value)
}

export function formatNumber(value: number): string {
  return numberFormat.format(value)
}

export function formatPercent(value: number): string {
  return percentFormat.format(value)
}

/** Formatter for a number style, e.g. the format chosen for an axis. */
export function createNumberFormatter(
  style: NumberStyle,
  currency = 'USD',
): NumberFormatter {
  if (style === 'number') {
    return formatNumber
  }
  if (style === 'percent') {
    return formatPercent
  }
  const currencyFormat = new Intl.NumberFormat(LOCALE, {
    currency,
    currencyDisplay: 'narrowSymbol',
    maximumFractionDigits: 2,
    style: 'currency',
  })
  return (value) => currencyFormat.format(value)
}
