import { getPlacementLabel } from '@/shared/layout'
import Button from './Button'

import type { HorizontalAlignment, Side } from '@/shared/layout'

// ===== TYPES =================================================================
/** Side and place along it, e.g. a legend at the top, centered. */
type Placement = {
  alignment?: HorizontalAlignment
  position: Side
}

/** One cell of the grid, standing for one placement. */
type PositionCell = Required<Placement>

type PositionGridProps = {
  label: string
  value: Placement
  variant?: 'cross' | 'grid'
  onChange: (value: Placement) => void
}

// ===== CONSTANTS =============================================================
/**
 * Cells of the grid row by row; null is the plot in the middle. Top and
 * bottom offer start, center and end, the left and right side only their
 * middle; the cross keeps only the middle of each side.
 */
const positionCells: (PositionCell | null)[] = [
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

// ===== HELPERS ===============================================================
/** Tells a left or right side, along which items line up vertically. */
function isVerticalSide(position: Side): boolean {
  return position === 'left' || position === 'right'
}

/**
 * Tells whether a cell shows the current placement. A left or right cell,
 * and every cell of the cross, stands for its whole side.
 * @param cell Cell of the grid.
 * @param value Current placement.
 * @param isCross Whether the grid is the cross of the four sides.
 * @returns True when the cell is the chosen one.
 */
function isCellActive(
  cell: PositionCell,
  value: Placement,
  isCross: boolean,
): boolean {
  if (cell.position !== value.position) {
    return false
  }
  return (
    isCross ||
    isVerticalSide(cell.position) ||
    cell.alignment === value.alignment
  )
}

// ===== COMPONENT =============================================================
/**
 * 3×3 grid that places an element around the plot; the middle cell is
 * the plot. The grid sets side and alignment, e.g. of a legend: top and
 * bottom offer start, center and end, left and right their middle. The
 * cross offers only the four sides, e.g. of the color scale. The chosen
 * cell shows a bar in the direction the element lines up its items.
 */
function PositionGrid({
  label,
  value,
  variant = 'grid',
  onChange,
}: PositionGridProps) {
  const isCross = variant === 'cross'
  return (
    <div className="position-grid" role="group" aria-label={label}>
      {positionCells.map((cell, index) => {
        if (!cell) {
          return (
            <span
              aria-hidden="true"
              className="position-grid-plot"
              key="plot"
            />
          )
        }
        const isCorner =
          !isVerticalSide(cell.position) && cell.alignment !== 'center'
        if (isCross && isCorner) {
          return <span aria-hidden="true" key={index} />
        }
        const cellLabel = getPlacementLabel(
          cell.position,
          isCross ? undefined : cell.alignment,
        )
        const isActive = isCellActive(cell, value, isCross)
        return (
          <Button
            aria-label={cellLabel}
            aria-pressed={isActive}
            className={`position-grid-cell ${
              isVerticalSide(cell.position) ? 'is-vertical' : ''
            }`}
            isActive={isActive}
            key={index}
            title={cellLabel}
            onClick={() => {
              onChange(
                isCross
                  ? { position: cell.position }
                  : { alignment: cell.alignment, position: cell.position },
              )
            }}
          />
        )
      })}
    </div>
  )
}

export default PositionGrid
