import { Eye, EyeOff, Paintbrush, Plus } from 'lucide-react'
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
  title?: string
  visibility?: FormatVisibility
  onAdd?: () => void
  onFormat?: () => void
}

// ===== COMPONENT =============================================================
/**
 * One group of format rows, e.g. in the format panel. The title becomes a
 * small heading; a visibility becomes an eye on its right, which also
 * shows or hides the rows, `onAdd` a plus that adds what the rows edit,
 * e.g. an effect, and `onFormat` a paintbrush that opens another element.
 * These icons stand in the icon column of the rows below. Without a title
 * the rows stand alone, e.g. in a section of the build panel.
 * @param props Rows, optional title, visibility, add and format action.
 */
function FormatWidget({
  children,
  title,
  visibility,
  onAdd,
  onFormat,
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
    <div ref={widgetRef} className="format-widget stack">
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
            {onFormat ? (
              <IconButton
                label={`Format ${title.toLowerCase()}`}
                size="xs"
                variant="ghost"
                onClick={onFormat}
              >
                <Paintbrush size={14} />
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
