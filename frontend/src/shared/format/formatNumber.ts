import { LOCALE } from '../config'

import type { NumberFormat } from './valueFormats'

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

/** Most fraction digits per style when a format leaves decimals open. */
const AUTO_FRACTION_DIGITS = {
  currency: 2,
  number: 2,
  percent: 1,
} satisfies Record<NumberStyle, number>

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

/**
 * Fraction digits of a format: fixed when decimals are set, otherwise the
 * style's maximum; compact notation keeps its own short rounding.
 * @param format Number format of one element.
 * @param style Style the value is shown in, auto already resolved.
 * @returns Fraction digit options for Intl.NumberFormat.
 */
function getFractionDigits(
  format: NumberFormat,
  style: NumberStyle,
): Intl.NumberFormatOptions {
  if (format.decimals !== null) {
    return {
      maximumFractionDigits: format.decimals,
      minimumFractionDigits: format.decimals,
    }
  }
  return format.compact
    ? {}
    : { maximumFractionDigits: AUTO_FRACTION_DIGITS[style] }
}

/**
 * Formatter for a number format, e.g. the one chosen for an axis. Auto
 * formats like number; places with their own default resolve it first.
 * @param format Number format of one element.
 * @returns Function that turns a value into its text, with prefix and suffix.
 */
export function createNumberFormatter(format: NumberFormat): NumberFormatter {
  const style = format.style === 'auto' ? 'number' : format.style
  const intlFormat = new Intl.NumberFormat(LOCALE, {
    ...getFractionDigits(format, style),
    currency: format.currency,
    currencyDisplay: 'narrowSymbol',
    notation: format.compact ? 'compact' : 'standard',
    style: style === 'number' ? 'decimal' : style,
  })
  return (value) =>
    `${format.prefix}${intlFormat.format(value)}${format.suffix}`
}

/**
 * Picks the format a value is shown in; auto hands over to the format the
 * element follows, e.g. data labels follow the Y axis.
 * @param format Number format of the element.
 * @param fallback Number format the element follows with auto.
 * @returns The element's own format, or the fallback for auto.
 */
export function resolveNumberFormat(
  format: NumberFormat,
  fallback: NumberFormat,
): NumberFormat {
  return format.style === 'auto' ? fallback : format
}
