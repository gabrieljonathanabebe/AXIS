import type { DataSelection } from '../types/workspace'

// ===== FUNCTION ==============================================================
export function isSameSelection(
  first: DataSelection | null,
  second: DataSelection | null,
): boolean {
  if (!first || !second) {
    return first === second
  }
  return (
    first.sourceChartId === second.sourceChartId &&
    first.field === second.field &&
    first.values.length === second.values.length &&
    first.values.every((value, index) => value === second.values[index])
  )
}
