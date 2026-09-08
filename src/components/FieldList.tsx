import type { DataField } from '../types/chart'

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
          className={`chip field-chip ${
            selectedField?.name === field.name ? 'is-active' : ''
          }`}
          type="button"
          key={field.name}
          onClick={() => onSelectField(field)}
        >
          <span>{field.name}</span>
          <span className="field-type">{field.type}</span>
        </button>
      ))}
    </div>
  )
}

export default FieldList
