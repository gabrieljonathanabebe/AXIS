import ControlRow from './ControlRow'
import Toggle from './Toggle'

import type { ReactNode } from 'react'

// ===== TYPES =================================================================
type FormatWidgetProps = {
  children: ReactNode
  title: string
  visibility?: {
    label?: string
    visible: boolean
    onChange: (visible: boolean) => void
  }
}

// ===== COMPONENT =============================================================
/**
 * Rows of one format widget, e.g. a section of the format popover. A
 * visibility becomes the first row, "Visible" or a label like "Enabled".
 * @param props Title for the toggle's label, the rows and an optional
 *   visibility.
 */
function FormatWidget({ children, title, visibility }: FormatWidgetProps) {
  const visibilityLabel = visibility?.label ?? 'Visible'
  return (
    <div className="stack format-widget-content">
      {visibility ? (
        <ControlRow label={visibilityLabel}>
          <Toggle
            checked={visibility.visible}
            label={`${title} ${visibilityLabel.toLowerCase()}`}
            onCheckedChange={visibility.onChange}
          />
        </ControlRow>
      ) : null}
      {children}
    </div>
  )
}

export default FormatWidget
