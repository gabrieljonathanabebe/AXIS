import { Settings2 } from 'lucide-react'
import { useState } from 'react'

import IconButton from './IconButton'
import Popover from './Popover'

import type { ReactNode } from 'react'
import type { IconButtonSize } from './IconButton'

// ===== TYPES =================================================================
type DetailsPopoverProps = {
  actions?: ReactNode
  children: ReactNode
  label: string
  size?: IconButtonSize
}

// ===== COMPONENT =============================================================
/**
 * Gear that opens rare settings in a small popover below it, e.g. prefix
 * and suffix of a number format. `actions` stand in its header before the
 * close button, e.g. a plus that adds a row; `size` fits the gear to its
 * place, e.g. `xs` in the header of a format widget. Inside the format
 * popover it nests, so a click in the details keeps both open.
 * @param props Rows of the details, their name, e.g. "Number format",
 * header actions and size of the gear.
 */
function DetailsPopover({
  actions,
  children,
  label,
  size = 'sm',
}: DetailsPopoverProps) {
  const [isOpen, setIsOpen] = useState(false)
  return (
    <Popover
      actions={actions}
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
          size={size}
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
