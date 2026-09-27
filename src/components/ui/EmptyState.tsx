import { useDroppable } from '@dnd-kit/core'
import type { DropTarget } from '../../types/ui'

type EmptyStateProps = {
  title: string
  description?: string
  dropId?: string
  dropTarget?: DropTarget
}

function EmptyState({
  title,
  description,
  dropId,
  dropTarget,
}: EmptyStateProps) {
  const droppable = useDroppable({
    data: { target: dropTarget },
    disabled: !dropId,
    id: dropId ?? 'empty-state',
  })
  return (
    <div
      className={`empty-state ${droppable.isOver ? 'is-over' : ''}`}
      ref={dropId ? droppable.setNodeRef : undefined}
    >
      <strong>{title}</strong>
      {description ? <span>{description}</span> : null}
    </div>
  )
}

export default EmptyState
