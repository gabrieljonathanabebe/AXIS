import type { DataRow } from '../types/chart'
import type { TableSort } from '../types/ui'

// ===== CONSTANTS =============================================================
const collator = new Intl.Collator(undefined, { numeric: true })

// ===== HELPERS ===============================================================
function compareValues(a: number | string, b: number | string): number {
  if (typeof a === 'number' && typeof b === 'number') {
    return a - b
  }
  return collator.compare(String(a), String(b))
}

// ===== FUNCTIONS =============================================================
// Missing values stay last in both directions.
export function sortRows(rows: DataRow[], sort: TableSort | null): DataRow[] {
  if (!sort) {
    return rows
  }
  const factor = sort.direction === 'asc' ? 1 : -1

  return [...rows].sort((rowA, rowB) => {
    const a = rowA[sort.fieldName]
    const b = rowB[sort.fieldName]

    if (a === null) {
      return b === null ? 0 : 1
    }
    if (b === null) {
      return -1
    }
    return compareValues(a, b) * factor
  })
}
