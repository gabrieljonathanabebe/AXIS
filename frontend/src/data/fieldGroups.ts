import { Calendar, CaseUpper, Hash, IdCard } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'

import { getSemanticRole } from './semanticRoles'

import type {
  DataField,
  FieldProfile,
  SemanticRole,
  SemanticRoleOverrides,
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

const fieldGroupKeyBySemanticRole: Record<SemanticRole, FieldGroupKey> = {
  dimension: 'dimensions',
  identifier: 'identifiers',
  measure: 'measures',
  temporal: 'time',
}

// ===== FUNCTIONS =============================================================
export function getFieldGroupKey(role: SemanticRole): FieldGroupKey {
  return fieldGroupKeyBySemanticRole[role]
}

export function getFieldGroupDefinition(
  role: SemanticRole,
): FieldGroupDefinition {
  const key = getFieldGroupKey(role)
  return fieldGroupDefinitions.find((definition) => definition.key === key)!
}

export function groupFields(
  fields: DataField[],
  profileFields: FieldProfile[],
  overrides: SemanticRoleOverrides,
): FieldGroup[] {
  const profileFieldsByName = new Map(
    profileFields.map((field) => [field.name, field]),
  )
  return groupByFieldGroup(fields, (field) => {
    const profileField = profileFieldsByName.get(field.name)
    return profileField
      ? getFieldGroupKey(getSemanticRole(profileField, overrides))
      : null
  })
}

export function groupFieldProfiles(
  fields: FieldProfile[],
  overrides: SemanticRoleOverrides,
): FieldGroup<FieldProfile>[] {
  return groupByFieldGroup(fields, (field) =>
    getFieldGroupKey(getSemanticRole(field, overrides)),
  )
}

// ===== HELPERS ===============================================================
function groupByFieldGroup<TField>(
  fields: TField[],
  getKey: (field: TField) => FieldGroupKey | null,
): FieldGroup<TField>[] {
  return fieldGroupDefinitions
    .map((definition) => ({
      ...definition,
      fields: fields.filter((field) => getKey(field) === definition.key),
    }))
    .filter((group) => group.fields.length > 0)
}
