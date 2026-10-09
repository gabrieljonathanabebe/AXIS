import type { DataField, FieldProfile, SemanticRole } from '../datasets/types'

export type SortDirection = 'asc' | 'desc'

export type TableSort = {
  direction: SortDirection
  fieldName: string
}

/** A table column with its profile and current (possibly overridden) role. */
export type DataTableColumn = {
  field: DataField
  profileField: FieldProfile | null
  semanticRole: SemanticRole | null
}
