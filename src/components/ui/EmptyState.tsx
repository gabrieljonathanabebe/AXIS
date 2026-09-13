import { useDroppable } from '@dnd-kit/core'

type EmptyStateProps = {
  title: string
  description?: string
  dropId?: string
}

function EmptyState({ title, description, dropId }: EmptyStateProps) {
  const droppable = useDroppable({
    id: dropId ?? 'empty-state',
    disabled: !dropId,
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