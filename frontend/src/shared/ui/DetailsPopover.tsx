import { Settings2 } from 'lucide-react'
import { useState } from 'react'

import IconButton from './IconButton'
import Popover from './Popover'

import type { ReactNode } from 'react'
import type { IconButtonSize } from './IconButton'
import type { PopoverTriggerProps } from './Popover'

// ===== TYPES =================================================================
/** Wiring of the element that opens the details, e.g. a gear or swatch. */
export type DetailsTriggerProps = PopoverTriggerProps & {
  onClick: () => void
}

type DetailsPopoverProps = {
  actions?: ReactNode
  children: ReactNode
  hasHeader?: boolean
  label: string
  open?: boolean
  size?: IconButtonSize
  onOpenChange?: (open: boolean) => void
  renderTrigger?: (props: DetailsTriggerProps) => ReactNode
}

// ===== COMPONENT =============================================================
/**
 * Popover of rare settings below its trigger, e.g. prefix and suffix of a
 * number format. The trigger is a gear unless `renderTrigger` gives
 * another, e.g. the swatch of a paint. Its header shows the name and
 * `actions` before the close button, e.g. a plus that adds a row;
 * without `hasHeader` it starts with its rows and closes on a click
 * outside, e.g. as the editor of a paint, whose rows say what it edits.
 * `size` fits the gear to its place, e.g. `xs` in the header of a format
 * widget. `open` and `onOpenChange` let a parent open it, e.g. right
 * after adding a row. Inside the format popover it nests, so a click in
 * the details keeps both open.
 * @param props Rows of the details, their name, e.g. "Number format",
 *   header, actions, size of the gear, trigger and open state.
 */
function DetailsPopover({
  actions,
  children,
  hasHeader = true,
  label,
  open,
  size = 'sm',
  onOpenChange,
  renderTrigger,
}: DetailsPopoverProps) {
  const [ownOpen, setOwnOpen] = useState(false)
  const isOpen = open ?? ownOpen
  const setIsOpen = onOpenChange ?? setOwnOpen

  /** Opens or closes the details from their trigger. */
  function toggle(): void {
    setIsOpen(!isOpen)
  }

  return (
    <Popover
      actions={actions}
      label={label}
      open={isOpen}
      className="details-popover glass glass-thick"
      title={hasHeader ? label : undefined}
      onOpenChange={setIsOpen}
      renderTrigger={(triggerProps) =>
        renderTrigger ? (
          renderTrigger({ ...triggerProps, onClick: toggle })
        ) : (
          <IconButton
            {...triggerProps}
            isActive={isOpen}
            label={`Advanced ${label.toLowerCase()}`}
            size={size}
            variant="ghost"
            onClick={toggle}
          >
            <Settings2 size={14} />
          </IconButton>
        )
      }
    >
      <div className="details-popover-body stack">{children}</div>
    </Popover>
  )
}

export default DetailsPopover
