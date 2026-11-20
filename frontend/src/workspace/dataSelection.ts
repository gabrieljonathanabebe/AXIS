import { createDateFormatter, parseDateValue } from '@/shared/format/formatDate'
import { formatNumber } from '@/shared/format/formatNumber'
import { DEFAULT_DATE_FORMAT } from '@/shared/format/valueFormats'
import { toIsoDate } from '@/shared/timeGrain'

import type { ChartFilter } from '@/charts/chartsApi'
import type { DataRow, DataValue } from '@/datasets/types'
import type { DataSelection, SelectionFilter } from './types'

// ===== HELPERS ===============================================================
/**
 * Turns a selection filter into the filter of chart and card queries.
 * @param filter Filter of the selection.
 * @returns The query filter; values as text, a date range without grain.
 */
function toQueryFilter(filter: SelectionFilter): ChartFilter {
  if (filter.kind === 'range') {
    return filter
  }
  if (filter.kind === 'date_range') {
    const { end, field, kind, start } = filter
    return { end, field, kind, start }
  }
  return {
    ...filter,
    values: filter.values.map((value) => String(value)),
  }
}

/**
 * Reads a row value as ISO date.
 * @param value Value of a row.
 * @returns E.g. "2025-03-14", or null for values that are no date.
 */
function toRowDate(value: DataValue | undefined): string | null {
  if (typeof value !== 'string' && typeof value !== 'number') {
    return null
  }
  const date = parseDateValue(value)
  return date ? toIsoDate(date) : null
}

// ===== FUNCTIONS =============================================================
/** Filters of a selection as chart and card queries expect them. */
export function getSelectionQueryFilters(
  selection: DataSelection | null,
): ChartFilter[] {
  return selection ? selection.filters.map(toQueryFilter) : []
}

/** Whether two selections come from the same chart with the same filters. */
export function isSameSelection(
  first: DataSelection | null,
  second: DataSelection | null,
): boolean {
  if (!first || !second) {
    return first === second
  }
  return (
    first.sourceChartId === second.sourceChartId &&
    JSON.stringify(first.filters) === JSON.stringify(second.filters)
  )
}

/** Whether a row matches one filter of a selection. */
export function matchesSelectionFilter(
  row: DataRow,
  filter: SelectionFilter,
): boolean {
  const value = row[filter.field]
  if (filter.kind === 'range') {
    return (
      typeof value === 'number' && value >= filter.min && value <= filter.max
    )
  }
  if (filter.kind === 'date_range') {
    const day = toRowDate(value)
    return day !== null && day >= filter.start && day <= filter.end
  }
  return filter.values.includes(String(value ?? ''))
}

/** Whether a row matches every filter of a selection. */
export function isRowInSelection(
  row: DataRow,
  selection: DataSelection | null,
): boolean {
  if (!selection) {
    return true
  }
  return selection.filters.every((filter) => {
    return matchesSelectionFilter(row, filter)
  })
}

/**
 * Keeps a selection only when the rows carry all of its fields, so rows
 * still loading a filtered field are not dimmed as unselected.
 * @param rows Loaded rows of a chart.
 * @param selection Active selection, or null when nothing is selected.
 * @returns The selection, or null while a filtered field is missing.
 */
export function getRowSelection(
  rows: DataRow[],
  selection: DataSelection | null,
): DataSelection | null {
  const [firstRow] = rows
  if (!selection || !firstRow) {
    return selection
  }
  const hasAllFields = selection.filters.every((filter) => {
    return filter.field in firstRow
  })
  return hasAllFields ? selection : null
}

/** Label of a selection, e.g. "United States" or "Mar 2025". */
export function formatSelectionLabel(selection: DataSelection): string {
  return selection.filters
    .map((filter) => {
      if (filter.kind === 'range') {
        const min = formatNumber(filter.min)
        const max = formatNumber(filter.max)
        return `${filter.field} ${min}–${max}`
      }
      if (filter.kind === 'date_range') {
        return createDateFormatter(
          DEFAULT_DATE_FORMAT,
          filter.grain,
        )(filter.start)
      }
      return filter.values.join(', ')
    })
    .join(' · ')
}
