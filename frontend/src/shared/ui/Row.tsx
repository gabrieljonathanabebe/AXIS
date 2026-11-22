import { Minus } from 'lucide-react'

import IconButton from './IconButton'

import type { ReactNode } from 'react'

// ===== TYPES =================================================================
/** Where the controls of a row sit on the grid of the format panel. */
export type RowLayout = 'pair' | 'single' | 'wide'

/** Minus of a row that removes what it edits, e.g. one fill of a list. */
export type RowRemove = {
  label: string
  onRemove: () => void
}

type RowProps = {
  action?: ReactNode
  children: ReactNode
  isFull?: boolean
  label?: string
  layout?: RowLayout
  remove?: RowRemove
}

// ===== COMPONENT =============================================================
/**
 * One row of controls. With a label, the label stands left of the
 * controls. Without one, the row sits on the grid of the format panel:
 * two field columns and an icon column, so fields and icons line up
 * across rows and with the icons of the group headings. `pair` puts two
 * fields side by side, `single` one field into the first column, `wide`
 * one field across both; a wide row without icon also takes the icon
 * column. `isFull` lets a pair without icon take it, too, e.g. in a group
 * whose rows have no icons. `action` is the one icon of the row, e.g. a
 * minus or the italic toggle.
 * @param props Controls, optional label, layout, width and action.
 */
function Row({
  action,
  children,
  isFull = false,
  label,
  layout = 'pair',
  remove,
}: RowProps) {
  if (!label) {
    const icon = remove ? (
      <IconButton
        label={remove.label}
        size="xs"
        variant="ghost"
        onClick={remove.onRemove}
      >
        <Minus size={14} />
      </IconButton>
    ) : (
      action
    )
    return (
      <div
        className={`row row-compact is-${layout} ${isFull ? 'is-full' : ''}`}
      >
        {children}
        {icon ? <div className="row-icon">{icon}</div> : null}
      </div>
    )
  }
  return (
    <div className="row">
      <span className="row-label">{label}</span>
      <div className="row-control">{children}</div>
    </div>
  )
}

export default Row
