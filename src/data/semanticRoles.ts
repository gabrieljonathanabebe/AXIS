import type {
  DataField,
  FieldProfile,
  PhysicalType,
  SemanticRole,
  SemanticRoleOverrides,
} from '../types/chart'

// ===== CONSTANTS =============================================================
export const semanticRoleLabels: Record<SemanticRole, string> = {
  dimension: 'Dimension',
  identifier: 'Identifier',
  measure: 'Measure',
  temporal: 'Temporal',
}

// Roles a user may assign, ordered like the field groups.
const semanticRolesByPhysicalType: Record<PhysicalType, SemanticRole[]> = {
  boolean: ['dimension'],
  date: ['temporal', 'dimension'],
  datetime: ['temporal', 'dimension'],
  float: ['measure', 'dimension', 'identifier'],
  integer: ['measure', 'dimension', 'identifier'],
  string: ['dimension', 'identifier'],
}

// ===== FUNCTIONS =============================================================
export function applySemanticRoleOverrides(
  fields: DataField[],
  overrides: SemanticRoleOverrides,
): DataField[] {
  return fields.map((field) => ({
    ...field,
    semantic_role: overrides[field.name] ?? field.semantic_role,
  }))
}

export function getAllowedSemanticRoles(field: FieldProfile): SemanticRole[] {
  const roles = semanticRolesByPhysicalType[field.physical_type]
  return roles.includes(field.semantic_role)
    ? roles
    : [field.semantic_role, ...roles]
}

export function getSemanticRole(
  field: FieldProfile,
  overrides: SemanticRoleOverrides,
): SemanticRole {
  return overrides[field.name] ?? field.semantic_role
}
