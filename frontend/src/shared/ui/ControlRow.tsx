import type { ReactNode } from 'react'

// ===== TYPES =================================================================
/** Where the fields of a row sit on the grid of the format panel. */
export type ControlRowLayout = 'pair' | 'single' | 'wide'

type ControlRowProps = {
  action?: ReactNode
  children: ReactNode
  isFull?: boolean
  label?: string
  layout?: ControlRowLayout
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
function ControlRow({
  action,
  children,
  isFull = false,
  label,
  layout = 'pair',
}: ControlRowProps) {
  if (!label) {
    return (
      <div
        className={`control-row control-row-compact is-${layout} ${isFull ? 'is-full' : ''}`}
      >
        {children}
        {action ? <div className="control-row-icon">{action}</div> : null}
      </div>
    )
  }
  return (
    <div className="control-row">
      <span className="control-row-label">{label}</span>
      <div className="control-row-control">{children}</div>
    </div>
  )
}

export default ControlRow
