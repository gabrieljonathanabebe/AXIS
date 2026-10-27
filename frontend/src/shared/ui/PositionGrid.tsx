import Button from './Button'

import type { Layout, Side } from '../layout'

// ===== TYPES =================================================================
/** Side and place along it, e.g. a legend at the top, centered. */
type Placement = Pick<Layout, 'alignment' | 'position'>

/** One cell of the grid: its name and the placement it stands for. */
type PositionCell = Placement & { label: string }

type PositionGridProps = {
  label: string
  value: Placement
  onChange: (value: Placement) => void
}

// ===== CONSTANTS =============================================================
/**
 * Cells of the grid row by row; null is the plot in the middle. Top and
 * bottom offer start, center and end, the left and right side only their
 * middle.
 */
const positionCells: (PositionCell | null)[] = [
  { alignment: 'start', label: 'Top left', position: 'top' },
  { alignment: 'center', label: 'Top center', position: 'top' },
  { alignment: 'end', label: 'Top right', position: 'top' },
  { alignment: 'center', label: 'Left', position: 'left' },
  null,
  { alignment: 'center', label: 'Right', position: 'right' },
  { alignment: 'start', label: 'Bottom left', position: 'bottom' },
  { alignment: 'center', label: 'Bottom center', position: 'bottom' },
  { alignment: 'end', label: 'Bottom right', position: 'bottom' },
]

// ===== HELPERS ===============================================================
/** Tells a left or right side, along which items line up vertically. */
function isVerticalSide(position: Side): boolean {
  return position === 'left' || position === 'right'
}

/**
 * Tells whether a cell shows the current placement. A left or right cell
 * stands for its whole side, so it also shows its start or end.
 * @param cell Cell of the grid.
 * @param value Current placement.
 * @returns True when the cell is the chosen one.
 */
function isCellActive(cell: PositionCell, value: Placement): boolean {
  if (cell.position !== value.position) {
    return false
  }
  return isVerticalSide(cell.position) || cell.alignment === value.alignment
}

// ===== COMPONENT =============================================================
/**
 * 3×3 grid that places an element around the plot, e.g. a legend: the top
 * and bottom rows set side and alignment, the middle row the left or right
 * side, and the middle cell is the plot. The chosen cell shows a bar in
 * the direction the element lines up its items.
 */
function PositionGrid({ label, value, onChange }: PositionGridProps) {
  return (
    <div className="position-grid" role="group" aria-label={label}>
      {positionCells.map((cell) => {
        if (!cell) {
          return (
            <span
              aria-hidden="true"
              className="position-grid-plot"
              key="plot"
            />
          )
        }
        const isActive = isCellActive(cell, value)
        return (
          <Button
            aria-label={cell.label}
            aria-pressed={isActive}
            className={`position-grid-cell ${
              isVerticalSide(cell.position) ? 'is-vertical' : ''
            }`}
            isActive={isActive}
            key={cell.label}
            title={cell.label}
            onClick={() => {
              onChange({ alignment: cell.alignment, position: cell.position })
            }}
          />
        )
      })}
    </div>
  )
}

export default PositionGrid
