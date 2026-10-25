import Toggle from './Toggle'

import type { ReactNode } from 'react'

// ===== TYPES =================================================================
/** Toggle that shows or hides a group or a whole element. */
export type FormatVisibility = {
  label?: string
  visible: boolean
  onChange: (visible: boolean) => void
}

type FormatWidgetProps = {
  children?: ReactNode
  title?: string
  visibility?: FormatVisibility
}

// ===== COMPONENT =============================================================
/**
 * One group of format rows, e.g. in the format popover. The title becomes a
 * small heading; a visibility becomes a toggle on its right, which also
 * shows or hides the rows. Without a title the rows stand alone, e.g. in a
 * section of the build panel.
 * @param props Rows, optional title and optional visibility.
 */
function FormatWidget({ children, title, visibility }: FormatWidgetProps) {
  const visibilityLabel = visibility?.label ?? 'Visible'
  const showsRows = visibility?.visible ?? true
  return (
    <div className="format-widget stack">
      {title ? (
        <div className="format-widget-header spread">
          <span className="format-widget-title">{title}</span>
          {visibility ? (
            <Toggle
              checked={visibility.visible}
              label={`${title} ${visibilityLabel.toLowerCase()}`}
              onCheckedChange={visibility.onChange}
            />
          ) : null}
        </div>
      ) : null}
      {showsRows && children ? (
        <div className="format-widget-content stack">{children}</div>
      ) : null}
    </div>
  )
}

export default FormatWidget
