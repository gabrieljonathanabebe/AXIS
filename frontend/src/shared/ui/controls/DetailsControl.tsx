import Editor from '../containers/Editor'
import Button from '../primitives/Button'
import Popover from '../primitives/Popover'

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
      <div className="color-swatch">
        <Popover
          className={fitsContent ? 'is-fit-content' : ''}
          label={label}
          variant="editor"
          renderTrigger={(triggerProps) => (
            <Button
              {...triggerProps}
              className="color-swatch-swatch has-icon"
              aria-label={`Edit ${label.toLowerCase()}`}
              title={label}
            >
              {icon}
            </Button>
          )}
        >
          <Editor>{children}</Editor>
        </Popover>
      </div>
      <span className="swatch-control-name">{text}</span>
    </div>
  )
}

export default DetailsControl
