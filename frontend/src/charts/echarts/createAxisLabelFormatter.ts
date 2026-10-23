import { formatDate } from '../../shared/format/formatDate'
import { createNumberFormatter } from '../../shared/format/formatNumber'

import type { NumberFormatter } from '../../shared/format/formatNumber'
import type { AxisAppearance } from '../types'

type AxisLabelValue = string | number

export type AxisLabelFormatter = (value: AxisLabelValue) => string

function toFiniteNumber(value: AxisLabelValue): number | null {
  if (value === '') {
    return null
  }

  const numericValue = Number(value)

  return Number.isFinite(numericValue) ? numericValue : null
}

/**
 * Creates the label formatter of an axis: dates for a date axis, otherwise
 * its number format; auto leaves the labels to ECharts.
 * @param axis Appearance of the axis.
 * @returns Formatter for ECharts, or undefined for the default labels.
 */
export function createAxisLabelFormatter(
  axis: AxisAppearance,
): AxisLabelFormatter | undefined {
  const { numberFormat, valueType } = axis.labels
  if (valueType === 'date') {
    return (value) => {
      const date = new Date(value)
      return Number.isNaN(date.getTime()) ? String(value) : formatDate(value)
    }
  }

  if (numberFormat.style === 'auto') {
    return undefined
  }

  const formatNumericValue = createAxisNumberFormatter(axis)

  return (value) => {
    const numericValue = toFiniteNumber(value)

    return numericValue === null
      ? String(value)
      : formatNumericValue(numericValue)
  }
}

/** Number formatter for values on this axis, e.g. data labels on Y. */
export function createAxisNumberFormatter(
  axis: AxisAppearance,
): NumberFormatter {
  return createNumberFormatter(axis.labels.numberFormat)
}
