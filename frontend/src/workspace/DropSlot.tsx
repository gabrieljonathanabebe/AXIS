import { useDroppable } from '@dnd-kit/core'

import type { ReactNode } from 'react'
import type { DropTarget } from './types'

type DropSlotProps = {
  ariaLabel: string
  className?: string
  hint?: string
  icon?: ReactNode
  id: string
  isDisabled?: boolean
  label: string
  target: DropTarget
  valueText: string
}

/**
 * Drop target for a dragged field, shown over an object: label, optional
 * hint and what the drop would do.
 */
function DropSlot({
  ariaLabel,
  className = '',
  hint,
  icon,
  id,
  isDisabled = false,
  label,
  target,
  valueText,
}: DropSlotProps) {
  const { isOver, setNodeRef } = useDroppable({
    data: { target },
    disabled: isDisabled,
    id,
  })
  return (
    <div
      aria-disabled={isDisabled}
      aria-label={ariaLabel}
      className={`encoding-drop-slot ${className} ${isOver ? 'is-over' : ''}`}
      ref={setNodeRef}
    >
      <span className="encoding-drop-slot-header">
        <span className="encoding-drop-slot-label">{label}</span>
        {hint ? <span className="encoding-drop-slot-hint">{hint}</span> : null}
      </span>
      <span className="encoding-drop-slot-value">
        {icon}
        {valueText}
      </span>
    </div>
  )
}

export default DropSlot
