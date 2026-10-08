import type { DataRow } from '../datasets/types'
import type { DataSelection, SelectionFilter } from '../types/workspace'

// ===== CONSTANTS =============================================================
const numberFormat = new Intl.NumberFormat(undefined, {
  maximumFractionDigits: 2,
})

// ===== FUNCTIONS =============================================================
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
  return filter.values.includes(String(value ?? ''))
}

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

export function formatSelectionLabel(selection: DataSelection): string {
  return selection.filters
    .map((filter) => {
      if (filter.kind === 'range') {
        const min = numberFormat.format(filter.min)
        const max = numberFormat.format(filter.max)
        return `${filter.field} ${min}–${max}`
      }
      return filter.values.join(', ')
    })
    .join(' · ')
}
