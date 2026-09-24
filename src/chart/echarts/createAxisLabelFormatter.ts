import type { AxisAppearance } from '../../types/chart'

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
    const formatter = new Intl.DateTimeFormat(undefined, {
      year: 'numeric',
      month: 'short',
      day: '2-digit',
    })

    return (value) => {
      const date = new Date(value)

      return Number.isNaN(date.getTime())
        ? String(value)
        : formatter.format(date)
    }
  }

  const options: Intl.NumberFormatOptions =
    axis.format === 'percent'
      ? {
          style: 'percent',
          maximumFractionDigits: 1,
        }
      : axis.format === 'currency'
        ? {
            style: 'currency',
            currency: axis.currency,
            currencyDisplay: 'narrowSymbol',
            maximumFractionDigits: 2,
          }
        : {
            maximumFractionDigits: 2,
          }

  const formatter = new Intl.NumberFormat(undefined, options)

  return (value) => {
    const numericValue = toFiniteNumber(value)

    return numericValue === null
      ? String(value)
      : formatter.format(numericValue)
  }
}
