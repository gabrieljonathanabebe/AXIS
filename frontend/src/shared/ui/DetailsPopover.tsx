import { Settings2 } from 'lucide-react'
import { useState } from 'react'

import IconButton from './IconButton'
import Popover from './Popover'

import type { ReactNode } from 'react'

// ===== TYPES =================================================================
type DetailsPopoverProps = {
  children: ReactNode
  label: string
}

// ===== COMPONENT =============================================================
/**
 * Gear at the end of a row that opens its rare settings in a small popover
 * below it, e.g. prefix and suffix of a number format. Inside the format
 * popover it nests, so a click in the details keeps both open.
 * @param props Rows of the details and their name, e.g. "Number format".
 */
function DetailsPopover({ children, label }: DetailsPopoverProps) {
  const [isOpen, setIsOpen] = useState(false)
  return (
    <Popover
      label={label}
      open={isOpen}
      className="details-popover glass glass-thick"
      title={label}
      onOpenChange={setIsOpen}
      renderTrigger={(triggerProps) => (
        <IconButton
          {...triggerProps}
          isActive={isOpen}
          label={`Advanced ${label.toLowerCase()}`}
          size="sm"
          variant="ghost"
          onClick={() => setIsOpen((currentValue) => !currentValue)}
        >
          <Settings2 size={14} />
        </IconButton>
      )}
    >
      <div className="details-popover-body stack">{children}</div>
    </Popover>
  )
}

export default DetailsPopover
