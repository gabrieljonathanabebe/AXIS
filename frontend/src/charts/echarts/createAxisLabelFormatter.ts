import { createDateFormatter } from '../../shared/format/formatDate'
import { createNumberFormatter } from '../../shared/format/formatNumber'

import type { DataField } from '../../datasets/types'
import type { DateFormatter } from '../../shared/format/formatDate'
import type { NumberFormatter } from '../../shared/format/formatNumber'
import type { AxisAppearance } from '../types'

type AxisLabelValue = string | number

export type AxisLabelFormatter = (value: AxisLabelValue) => string

/**
 * Reads an axis value as number.
 * @param value Value of an axis tick.
 * @returns The finite number, or null for empty and non-numeric values.
 */
function toFiniteNumber(value: AxisLabelValue): number | null {
  if (value === '') {
    return null
  }

  const numericValue = Number(value)

  return Number.isFinite(numericValue) ? numericValue : null
}

/**
 * Creates the date formatter of an axis if it shows dates: chosen as Date,
 * or a date field with the auto format.
 * @param axis Appearance of the axis.
 * @param field Field on the axis, if known.
 * @returns Formatter for the dates, or null for an axis without dates.
 */
export function createAxisDateFormatter(
  axis: AxisAppearance,
  field: DataField | undefined,
): DateFormatter | null {
  const { dateFormat, numberFormat, valueType } = axis.labels
  const isDateField =
    field?.physical_type === 'date' || field?.physical_type === 'datetime'
  const showsDates =
    valueType === 'date' || (isDateField && numberFormat.style === 'auto')

  return showsDates ? createDateFormatter(dateFormat, null) : null
}

/**
 * Creates the label formatter of an axis: dates for a date axis, otherwise
 * its number format; auto leaves the labels to ECharts.
 * @param axis Appearance of the axis.
 * @param field Field on the axis, if known; a date field shows dates.
 * @returns Formatter for ECharts, or undefined for the default labels.
 */
export function createAxisLabelFormatter(
  axis: AxisAppearance,
  field?: DataField,
): AxisLabelFormatter | undefined {
  const formatDateValue = createAxisDateFormatter(axis, field)
  if (formatDateValue) {
    return formatDateValue
  }

  if (axis.labels.numberFormat.style === 'auto') {
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
