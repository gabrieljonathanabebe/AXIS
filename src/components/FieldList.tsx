import { useDraggable } from '@dnd-kit/core'
import type { DataField } from '../types/chart'
import DataTypeIcon from './DataTypeIcon'

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
  onSelectField
}: DraggableFieldChipProps) {
  const { attributes, listeners, setNodeRef, isDragging } =
    useDraggable({
      id: `field:${field.name}`
    })
  return (
    <button
      ref={setNodeRef}
      className={`chip field-chip ${isSelected ? "is-active" : ""} ${isDragging ? "is-dragging" : ""
        }`}
      type='button'
      key={field.name}
      title={`Type: ${field.type}`}
      onClick={() => onSelectField(field)}
      {...listeners}
      {...attributes}
    >
      <span className='field-chip-title'>
        <span className='field-chip-icon'>
          <DataTypeIcon type={field.type} />
        </span>
        <span>{field.name}</span>
      </span>
    </button>
  )
}

function FieldList({
  fields,
  selectedField,
  onSelectField,
}: FieldListProps) {
  return (
    <div className="field-list">
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
