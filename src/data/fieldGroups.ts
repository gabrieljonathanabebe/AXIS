import { Calendar, CaseUpper, Hash, IdCard } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'

import type {
  DataField,
  FieldProfile,
  SemanticRole,
  SemanticType,
} from '../types/chart'

// ===== TYPES =================================================================
export type FieldGroupKey = 'dimensions' | 'identifiers' | 'measures' | 'time'

export type FieldGroupDefinition = {
  key: FieldGroupKey
  label: string
  icon: LucideIcon
  defaultOpen: boolean
}

export type FieldGroup<TField = DataField> = FieldGroupDefinition & {
  fields: TField[]
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

// Build Panel grouping until it reads semantic roles (Slice 5).
const fieldGroupKeyBySemanticType: Record<SemanticType, FieldGroupKey> = {
  categorical: 'dimensions',
  identifier: 'identifiers',
  numeric: 'measures',
  temporal: 'time',
}

const fieldGroupKeyBySemanticRole: Record<SemanticRole, FieldGroupKey> = {
  dimension: 'dimensions',
  identifier: 'identifiers',
  measure: 'measures',
  temporal: 'time',
}

// ===== FUNCTIONS =============================================================
export function getFieldGroupKey(field: DataField): FieldGroupKey {
  return fieldGroupKeyBySemanticType[field.semantic_type]
}

export function groupFields(fields: DataField[]): FieldGroup[] {
  return groupByFieldGroup(fields, getFieldGroupKey)
}

export function groupFieldProfiles(
  fields: FieldProfile[],
): FieldGroup<FieldProfile>[] {
  return groupByFieldGroup(
    fields,
    (field) => fieldGroupKeyBySemanticRole[field.semantic_role],
  )
}

// ===== HELPERS ===============================================================
function groupByFieldGroup<TField>(
  fields: TField[],
  getKey: (field: TField) => FieldGroupKey,
): FieldGroup<TField>[] {
  return fieldGroupDefinitions
    .map((definition) => ({
      ...definition,
      fields: fields.filter((field) => getKey(field) === definition.key),
    }))
    .filter((group) => group.fields.length > 0)
}
