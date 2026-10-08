import { useDroppable } from '@dnd-kit/core'
import type { DropTarget } from '../../types/ui'
import { useEffect, useRef } from 'react'

type EmptyStateProps = {
  description?: string
  dropId?: string
  dropTarget?: DropTarget
  recoverFocus?: boolean
  title: string
}

function EmptyState({
  description,
  dropId,
  dropTarget,
  recoverFocus = false,
  title,
}: EmptyStateProps) {
  const droppable = useDroppable({
    data: { target: dropTarget },
    disabled: !dropId,
    id: dropId ?? 'empty-state',
  })
  const elementRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    const isFocusLost =
      !document.activeElement || document.activeElement === document.body
    if (recoverFocus && isFocusLost) {
      elementRef.current?.focus()
    }
  }, [recoverFocus])

  return (
    <div
      className={`empty-state ${droppable.isOver ? 'is-over' : ''}`}
      ref={(node) => {
        elementRef.current = node
        if (dropId) {
          droppable.setNodeRef(node)
        }
      }}
      tabIndex={recoverFocus ? -1 : undefined}
    >
      <strong>{title}</strong>
      {description ? <span>{description}</span> : null}
    </div>
  )
}

export default EmptyState
