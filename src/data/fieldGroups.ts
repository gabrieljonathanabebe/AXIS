import { Calendar, CaseUpper, Hash, IdCard } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'

import type { DataField, SemanticType } from '../types/chart'

// ===== TYPES =================================================================
export type FieldGroupKey = 'dimensions' | 'identifiers' | 'measures' | 'time'

export type FieldGroupDefinition = {
  key: FieldGroupKey
  label: string
  icon: LucideIcon
  defaultOpen: boolean
}

export type FieldGroup = FieldGroupDefinition & {
  fields: DataField[]
}

// ===== CONSTANTS =============================================================
export const fieldGroupDefinitions: FieldGroupDefinition[] = [
  { key: 'measures', label: 'Measures', icon: Hash, defaultOpen: true },
  {
    key: 'dimensions',
    label: 'Dimensions',
    icon: CaseUpper,
    defaultOpen: true,
  },
  { key: 'time', label: 'Time', icon: Calendar, defaultOpen: true },
  {
    key: 'identifiers',
    label: 'Identifiers',
    icon: IdCard,
    defaultOpen: false,
  },
]

// Approximation until profiling provides semantic roles.
const fieldGroupKeyBySemanticType: Record<SemanticType, FieldGroupKey> = {
  categorical: 'dimensions',
  identifier: 'identifiers',
  numeric: 'measures',
  temporal: 'time',
}

// ===== FUNCTIONS =============================================================
export function getFieldGroupKey(field: DataField): FieldGroupKey {
  return fieldGroupKeyBySemanticType[field.semantic_type]
}

export function groupFields(fields: DataField[]): FieldGroup[] {
  return fieldGroupDefinitions
    .map((definition) => ({
      ...definition,
      fields: fields.filter(
        (field) => getFieldGroupKey(field) === definition.key,
      ),
    }))
    .filter((group) => group.fields.length > 0)
}
