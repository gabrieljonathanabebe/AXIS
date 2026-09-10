import type { DataField } from '../types/chart'
import DataTypeIcon from './DataTypeIcon'

type FieldListProps = {
  fields: DataField[]
  selectedField: DataField | null
  onSelectField: (field: DataField) => void
}

function FieldList({
  fields,
  selectedField,
  onSelectField,
}: FieldListProps) {
  return (
    <div className="field-list">
      {fields.map((field) => (
        <button
          className={`chip field-chip ${selectedField?.name === field.name ? 'is-active' : ''
            }`}
          type="button"
          key={field.name}
          title={`Type: ${field.type}`}
          onClick={() => onSelectField(field)}
        >
          <span className="field-chip-title">
            <span className="field-chip-icon">
              <DataTypeIcon type={field.type} />
            </span>
            <span>{field.name}</span>
          </span>
        </button>
      ))}
    </div>
  )
}

export default FieldList
