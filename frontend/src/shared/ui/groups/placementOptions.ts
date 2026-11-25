import { getPlacementLabel, getSideOrientation } from '@/shared/layout'

import type { HorizontalAlignment, Side } from '@/shared/layout'
import type { OptionItem } from '@/shared/optionItem'

// ===== TYPES =================================================================
/** Side and place along it, e.g. a legend at the top, centered. */
export type Placement = {
  alignment?: HorizontalAlignment
  position: Side
}

/** Value of one cell: a whole side, or top or bottom with an alignment. */
export type PlacementKey = Side | `${'bottom' | 'top'}-${HorizontalAlignment}`

// ===== CONSTANTS =============================================================
/**
 * Cells of the 3×3 grid around the plot, row by row; null is the plot in
 * the middle. Top and bottom offer start, center and end, left and right
 * only their middle.
 */
const GRID_CELLS: (Required<Placement> | null)[] = [
  { alignment: 'start', position: 'top' },
  { alignment: 'center', position: 'top' },
  { alignment: 'end', position: 'top' },
  { alignment: 'center', position: 'left' },
  null,
  { alignment: 'center', position: 'right' },
  { alignment: 'start', position: 'bottom' },
  { alignment: 'center', position: 'bottom' },
  { alignment: 'end', position: 'bottom' },
]

// ===== FUNCTIONS =============================================================
/**
 * Key of a placement; left and right, and a side without alignment, stand
 * for the whole side, e.g. left at the start → "left", top at the end →
 * "top-end".
 * @param placement Side and optional alignment.
 * @returns Key of the cell that shows it.
 */
export function toPlacementKey({
  alignment,
  position,
}: Placement): PlacementKey {
  if (!alignment || getSideOrientation(position) === 'vertical') {
    return position
  }
  return `${position}-${alignment}` as PlacementKey
}

/**
 * Placement of a cell; with an alignment, left and right take the center,
 * e.g. "top-end" → top at the end, "left" → left, centered.
 * @param key Key of the cell.
 * @param withAlignment Whether the element has an alignment.
 * @returns Side and, with an alignment, the place along it.
 */
export function toPlacement(
  key: PlacementKey,
  withAlignment: boolean,
): Placement {
  const [position, alignment = 'center'] = key.split('-') as [
    Side,
    HorizontalAlignment?,
  ]
  return withAlignment ? { alignment, position } : { position }
}

/**
 * Cells of the grid as options, row by row; null leaves a cell empty: the
 * plot in the middle and, without an alignment, the corners, so only the
 * cross of the four sides remains, e.g. for a color scale.
 * @param withAlignment Whether the element has an alignment, e.g. a legend.
 * @returns Nine cells for a grid of three columns.
 */
export function getPlacementOptions(
  withAlignment: boolean,
): (OptionItem<PlacementKey> | null)[] {
  return GRID_CELLS.map((cell) => {
    if (!cell) {
      return null
    }
    const isCorner =
      getSideOrientation(cell.position) === 'horizontal' &&
      cell.alignment !== 'center'
    if (!withAlignment && isCorner) {
      return null
    }
    const alignment = withAlignment ? cell.alignment : undefined
    return {
      label: getPlacementLabel(cell.position, alignment),
      value: toPlacementKey({ alignment, position: cell.position }),
    }
  })
}
