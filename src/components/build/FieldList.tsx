import { useDraggable } from '@dnd-kit/core'
import Chip from '../ui/Chip'
import type { DataField } from '../../types/chart'
import DataTypeIcon from '../data/DataTypeIcon'
import IconBadge from '../ui/IconBadge'

type FieldListProps = {
  fields: DataField[]
  selectedField: DataField | null
  onSelectField: (field: DataField) => void
}

type DraggableFieldChipProps = {
  field: DataField
  isSelected: boolean
  onSelectField: (field: DataField) => void
}

function DraggableFieldChip({
  field,
  isSelected,
  onSelectField,
}: DraggableFieldChipProps) {
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id: `field:${field.name}`,
    data: {
      payload: {
        kind: 'field',
        field,
      },
    },
  })
  return (
    <Chip
      ref={setNodeRef}
      className={`field-chip cluster full-width ${isDragging ? 'is-dragging' : ''}`}
      isActive={isSelected}
      title={`Type: ${field.semantic_type}`}
      onClick={() => onSelectField(field)}
      {...listeners}
      {...attributes}
    >
      <IconBadge label={field.name}>
        <DataTypeIcon type={field.semantic_type} />
      </IconBadge>
    </Chip>
  )
}

function FieldList({ fields, selectedField, onSelectField }: FieldListProps) {
  return (
    <div className="stack">
      {fields.map((field) => (
        <DraggableFieldChip
          field={field}
          isSelected={selectedField?.name === field.name}
          onSelectField={onSelectField}
          key={field.name}
        />
      ))}
    </div>
  )
}

export default FieldList
