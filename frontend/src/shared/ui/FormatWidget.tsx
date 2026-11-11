import { Eye, EyeOff, Plus } from 'lucide-react'
import { useEffect, useRef } from 'react'

import IconButton from './IconButton'

import type { ReactNode } from 'react'

// ===== TYPES =================================================================
/** Shows or hides a group or a whole element, e.g. by its eye. */
export type FormatVisibility = {
  visible: boolean
  onChange: (visible: boolean) => void
}

type FormatWidgetProps = {
  children?: ReactNode
  group?: string
  title?: string
  visibility?: FormatVisibility
  onAdd?: () => void
}

// ===== COMPONENT =============================================================
/**
 * One group of format rows, e.g. in the format panel. The title becomes a
 * small heading; a visibility becomes an eye on its right, which also
 * shows or hides the rows, and `onAdd` a plus that adds what the rows edit,
 * e.g. an effect. These icons stand in the icon column of the rows below.
 * `group` names the part of the object the group formats when it differs
 * from the element of the panel, e.g. the data labels within the marks; a
 * group inside a group is a subgroup with a quieter heading. Without a
 * title the rows stand alone, e.g. in a section of the build panel.
 * @param props Rows, optional title, part, visibility and add action.
 */
function FormatWidget({
  children,
  group,
  title,
  visibility,
  onAdd,
}: FormatWidgetProps) {
  const visibilityAction = visibility?.visible ? 'Hide' : 'Show'
  const showsRows = visibility?.visible ?? true
  const widgetRef = useRef<HTMLDivElement | null>(null)
  const revealsAdded = useRef(false)

  useEffect(() => {
    if (revealsAdded.current) {
      revealsAdded.current = false
      widgetRef.current?.scrollIntoView({
        behavior: 'smooth',
        block: 'nearest',
      })
    }
  })

  /**
   * Adds what the rows edit and scrolls the group into view once the new
   * row is rendered, e.g. an effect at the bottom of the popover.
   */
  function handleAdd(): void {
    revealsAdded.current = true
    onAdd?.()
  }
  return (
    <div
      className="format-widget stack"
      data-format-group={group}
      ref={widgetRef}
    >
      {title ? (
        <div className="format-widget-header">
          <span className="format-widget-title">{title}</span>
          <span className="cluster">
            {visibility ? (
              <IconButton
                label={`${visibilityAction} ${title.toLowerCase()}`}
                size="xs"
                variant="ghost"
                onClick={() => visibility.onChange(!visibility.visible)}
              >
                {visibility.visible ? <Eye size={14} /> : <EyeOff size={14} />}
              </IconButton>
            ) : null}
            {onAdd ? (
              <IconButton
                label={`Add ${title.toLowerCase()}`}
                size="xs"
                variant="ghost"
                onClick={handleAdd}
              >
                <Plus size={14} />
              </IconButton>
            ) : null}
          </span>
        </div>
      ) : null}
      {showsRows && children ? (
        <div className="format-widget-content stack">{children}</div>
      ) : null}
    </div>
  )
}

export default FormatWidget
