import { formatDate } from '../shared/format/formatDate'
import { formatNumber } from '../shared/format/formatNumber'

import type { TableFilter } from './tableApi'

// ===== FUNCTIONS =============================================================
// A range with one open bound reads as a single comparison.
function formatBounds(
  field: string,
  lower: string | null,
  upper: string | null,
): string {
  if (lower === null) {
    return `${field} ≤ ${upper}`
  }
  if (upper === null) {
    return `${field} ≥ ${lower}`
  }
  return `${field} ${lower}–${upper}`
}

export function formatTableFilter(filter: TableFilter): string {
  const { field } = filter
  if (filter.kind === 'values') {
    const shown = filter.values.slice(0, 2).join(', ')
    const more = filter.values.length > 2 ? ` +${filter.values.length - 2}` : ''
    return `${field} = ${shown}${more}`
  }
  if (filter.kind === 'date_range') {
    return formatBounds(
      field,
      filter.start === null ? null : formatDate(filter.start),
      filter.end === null ? null : formatDate(filter.end),
    )
  }
  return formatBounds(
    field,
    filter.min === null ? null : formatNumber(filter.min),
    filter.max === null ? null : formatNumber(filter.max),
  )
}

// One filter per field; `null` removes the field's filter.
export function setFieldFilter(
  filters: TableFilter[],
  fieldName: string,
  filter: TableFilter | null,
): TableFilter[] {
  const otherFilters = filters.filter((item) => item.field !== fieldName)
  return filter ? [...otherFilters, filter] : otherFilters
}
