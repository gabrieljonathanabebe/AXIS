import { getPositionLabel, getSideOrientation } from '@/shared/layout'

import type { HorizontalAlignment, Position, Side } from '@/shared/layout'
import type { OptionItem } from '@/shared/optionItem'

// ===== TYPES =================================================================
/** Side and place along it, e.g. a legend at the top, centered. */
export type GridPosition = Partial<Pick<Position, 'alignment'>> &
  Pick<Position, 'side'>

/** Value of one cell: a whole side, or top or bottom with an alignment. */
export type PositionKey = Side | `${'bottom' | 'top'}-${HorizontalAlignment}`

// ===== CONSTANTS =============================================================
/**
 * Cells of the 3×3 grid around the plot, row by row; null is the plot in
 * the middle. Top and bottom offer start, center and end, left and right
 * only their middle.
 */
const GRID_CELLS: (Position | null)[] = [
  { alignment: 'start', side: 'top' },
  { alignment: 'center', side: 'top' },
  { alignment: 'end', side: 'top' },
  { alignment: 'center', side: 'left' },
  null,
  { alignment: 'center', side: 'right' },
  { alignment: 'start', side: 'bottom' },
  { alignment: 'center', side: 'bottom' },
  { alignment: 'end', side: 'bottom' },
]

// ===== FUNCTIONS =============================================================
/**
 * Key of a position; left and right, and a side without alignment, stand
 * for the whole side, e.g. left at the start → "left", top at the end →
 * "top-end".
 * @param position Side and optional alignment.
 * @returns Key of the cell that shows it.
 */
export function toPositionKey({ alignment, side }: GridPosition): PositionKey {
  if (!alignment || getSideOrientation(side) === 'vertical') {
    return side
  }
  return `${side}-${alignment}` as PositionKey
}

/**
 * Position of a cell; with an alignment, left and right take the center,
 * e.g. "top-end" → top at the end, "left" → left, centered.
 * @param key Key of the cell.
 * @param withAlignment Whether the element has an alignment.
 * @returns Side and, with an alignment, the place along it.
 */
export function toPosition(
  key: PositionKey,
  withAlignment: boolean,
): GridPosition {
  const [side, alignment = 'center'] = key.split('-') as [
    Side,
    HorizontalAlignment?,
  ]
  return withAlignment ? { alignment, side } : { side }
}

/**
 * Cells of the grid as options, row by row; null leaves a cell empty: the
 * plot in the middle and, without an alignment, the corners, so only the
 * cross of the four sides remains, e.g. for a color scale.
 * @param withAlignment Whether the element has an alignment, e.g. a legend.
 * @returns Nine cells for a grid of three columns.
 */
export function getPositionOptions(
  withAlignment: boolean,
): (OptionItem<PositionKey> | null)[] {
  return GRID_CELLS.map((cell) => {
    if (!cell) {
      return null
    }
    const isCorner =
      getSideOrientation(cell.side) === 'horizontal' &&
      cell.alignment !== 'center'
    if (!withAlignment && isCorner) {
      return null
    }
    const alignment = withAlignment ? cell.alignment : undefined
    return {
      label: getPositionLabel(cell.side, alignment),
      value: toPositionKey({ alignment, side: cell.side }),
    }
  })
}
