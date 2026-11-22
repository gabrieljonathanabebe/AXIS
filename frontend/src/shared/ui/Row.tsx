import { Minus, Settings2 } from 'lucide-react'

import Editor from './Editor'
import IconButton from './IconButton'
import Popover from './Popover'

import type { ReactNode } from 'react'

// ===== TYPES =================================================================
/** Where the controls of a row sit on the grid of the format panel. */
export type RowLayout = 'pair' | 'single' | 'wide'

/**
 * Gear of a row that opens rare settings in an editor with a header, e.g.
 * the color range of a scale.
 */
export type RowDetails = {
  content: ReactNode
  label: string
}

/** Minus of a row that removes what it edits, e.g. one fill of a list. */
export type RowRemove = {
  label: string
  onRemove: () => void
}

type RowProps = {
  action?: ReactNode
  children: ReactNode
  details?: RowDetails
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
 * whose rows have no icons. The icon column holds one icon: the minus of
 * `remove`, else the gear of `details`, else `action`, e.g. the italic
 * toggle.
 * @param props Controls, optional label, layout, width and icon.
 */
function Row({
  action,
  children,
  details,
  isFull = false,
  label,
  layout = 'pair',
  remove,
}: RowProps) {
  /**
   * The one icon of the row: a minus, a gear that opens the details, or
   * the given action.
   * @returns The icon, or nothing.
   */
  function getIcon(): ReactNode {
    if (remove) {
      return (
        <IconButton
          label={remove.label}
          size="xs"
          variant="ghost"
          onClick={remove.onRemove}
        >
          <Minus size={14} />
        </IconButton>
      )
    }
    if (details) {
      return (
        <Popover
          label={details.label}
          variant="editor"
          renderTrigger={(triggerProps) => (
            <IconButton
              {...triggerProps}
              isActive={triggerProps['aria-expanded']}
              label={`Advanced ${details.label.toLowerCase()}`}
              size="xs"
              variant="ghost"
            >
              <Settings2 size={14} />
            </IconButton>
          )}
        >
          <Editor title={details.label}>{details.content}</Editor>
        </Popover>
      )
    }
    return action
  }
  if (!label) {
    const icon = getIcon()
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
