import Editor from '../containers/Editor'
import Popover from '../primitives/Popover'
import SwatchButton from '../primitives/SwatchButton'

import type { ReactNode } from 'react'

// ===== TYPES =================================================================
type DetailsControlProps = {
  children: ReactNode
  fitsContent?: boolean
  icon: ReactNode
  label: string
  text: string
}

// ===== COMPONENT =============================================================
/**
 * Control whose icon opens details, built like the control of a gradient: the
 * icon in place of the swatch, a short text next to it, e.g. the kind of
 * an effect or a preview of a number format. `fitsContent` gives the
 * details the width of their rows.
 * @param props Name for screen readers, icon, text, details and their
 *   width.
 */
function DetailsControl({
  children,
  fitsContent = false,
  icon,
  label,
  text,
}: DetailsControlProps) {
  return (
    <div className="control-frame swatch-control">
      <Popover
        className={fitsContent ? 'is-fit-content' : ''}
        label={label}
        variant="editor"
        renderTrigger={(triggerProps) => (
          <SwatchButton
            {...triggerProps}
            icon={icon}
            label={`Edit ${label.toLowerCase()}`}
            title={label}
          />
        )}
      >
        <Editor>{children}</Editor>
      </Popover>
      <span className="swatch-control-name">{text}</span>
    </div>
  )
}

export default DetailsControl
