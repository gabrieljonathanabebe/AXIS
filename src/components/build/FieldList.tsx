import { Search } from 'lucide-react'
import { useDraggable } from '@dnd-kit/core'
import { useState } from 'react'

import { groupFields } from '../../data/fieldGroups'
import Chip from '../ui/Chip'
import CollapsibleSection from '../ui/CollapsibleSection'
import TextInput from '../ui/TextInput'
import type { DataField } from '../../types/chart'

type FieldListProps = {
  fields: DataField[]
}

type DraggableFieldChipProps = {
  field: DataField
}

function DraggableFieldChip({ field }: DraggableFieldChipProps) {
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
      title={`${field.name} · ${field.semantic_type}`}
      {...listeners}
      {...attributes}
    >
      <span className="field-chip-label">{field.name}</span>
    </Chip>
  )
}

function FieldList({ fields }: FieldListProps) {
  const [query, setQuery] = useState('')
  const normalizedQuery = query.trim().toLowerCase()
  const isSearching = normalizedQuery !== ''
  const visibleFields = isSearching
    ? fields.filter((field) =>
        field.name.toLowerCase().includes(normalizedQuery),
      )
    : fields
  const fieldGroups = groupFields(visibleFields)

  return (
    <div className="stack">
      <TextInput
        label="Search fields"
        icon={<Search size={14} />}
        placeholder="Search fields"
        value={query}
        onValueChange={setQuery}
      />

      {fieldGroups.map(({ icon: Icon, ...group }) => (
        <CollapsibleSection
          title={group.label}
          icon={<Icon size={14} />}
          meta={group.fields.length}
          defaultOpen={group.defaultOpen}
          forceOpen={isSearching}
          variant="plain"
          key={group.key}
        >
          <div className="field-group stack">
            {group.fields.map((field) => (
              <DraggableFieldChip field={field} key={field.name} />
            ))}
          </div>
        </CollapsibleSection>
      ))}

      {isSearching && fieldGroups.length === 0 ? (
        <span className="field-list-empty">No matching fields</span>
      ) : null}
    </div>
  )
}

export default FieldList
