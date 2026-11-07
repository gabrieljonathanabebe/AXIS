import Button from './Button'
import DetailsPopover from './DetailsPopover'

import type { ReactNode } from 'react'

// ===== TYPES =================================================================
type DetailsFieldProps = {
  children: ReactNode
  icon: ReactNode
  label: string
  open?: boolean
  text: string
  onOpenChange?: (open: boolean) => void
}

// ===== COMPONENT =============================================================
/**
 * Field whose icon opens details, built like the field of a gradient: the
 * icon in place of the swatch, a short text next to it, e.g. the kind of
 * an effect or a preview of a number format. `open` and `onOpenChange`
 * let a list open the details itself, e.g. after adding, like the field
 * of a paint.
 * @param props Name for screen readers, icon, text, details and open
 *   state.
 */
function DetailsField({
  children,
  icon,
  label,
  open,
  text,
  onOpenChange,
}: DetailsFieldProps) {
  return (
    <div className="field color-field">
      <div className="color-swatch">
        <DetailsPopover
          hasHeader={false}
          label={label}
          open={open}
          onOpenChange={onOpenChange}
          renderTrigger={(triggerProps) => (
            <Button
              {...triggerProps}
              className="color-swatch-swatch has-icon"
              type="button"
              aria-label={`Edit ${label.toLowerCase()}`}
              title={label}
            >
              {icon}
            </Button>
          )}
        >
          {children}
        </DetailsPopover>
      </div>
      <span className="color-field-name">{text}</span>
    </div>
  )
}

export default DetailsField
