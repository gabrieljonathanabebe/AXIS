import type { ChartEncoding } from '../../../types/chart'
import type { DataSelection } from '../../../types/workspace'

// ===== CONSTANTS =============================================================
const DIMMED_OPACITY = 0.2

// ===== FUNCTION ==============================================================
export function getSelectionOpacity(
  selection: DataSelection | null,
  encoding: ChartEncoding,
  category: string,
): number | undefined {
  if (!selection || selection.field !== encoding.x?.name) {
    return undefined
  }
  return selection.values.includes(category) ? undefined : DIMMED_OPACITY
}
