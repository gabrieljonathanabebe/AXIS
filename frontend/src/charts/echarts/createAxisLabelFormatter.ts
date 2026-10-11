import type { AxisAppearance } from '../types'
import {
  createNumberFormatter,
  formatNumber,
} from '../../shared/format/formatNumber'
import { formatDate } from '../../shared/format/formatDate'
import type { NumberFormatter } from '../../shared/format/formatNumber'

type AxisLabelValue = string | number

export type AxisLabelFormatter = (value: AxisLabelValue) => string

function toFiniteNumber(value: AxisLabelValue): number | null {
  if (value === '') {
    return null
  }

  const numericValue = Number(value)

  return Number.isFinite(numericValue) ? numericValue : null
}

export function createAxisLabelFormatter(
  axis: AxisAppearance,
): AxisLabelFormatter | undefined {
  if (axis.format === 'auto') {
    return undefined
  }

  if (axis.format === 'date') {
    return (value) => {
      const date = new Date(value)
      return Number.isNaN(date.getTime()) ? String(value) : formatDate(value)
    }
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
  if (axis.format === 'auto' || axis.format === 'date') {
    return formatNumber
  }
  return createNumberFormatter(axis.format, axis.currency)
}
