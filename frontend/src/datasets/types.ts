// ===== FIELD =================================================================
/** Storage type of a column, as detected by the backend. */
export type PhysicalType =
  'integer' | 'float' | 'string' | 'boolean' | 'date' | 'datetime'

/** Analytical meaning of a field; decides how charts may use it. */
export type SemanticRole = 'measure' | 'dimension' | 'temporal' | 'identifier'

/** Name, physical type and (possibly overridden) semantic role. */
export type DataField = {
  name: string
  physical_type: PhysicalType
  semantic_role: SemanticRole
}

/** User corrections of the detected semantic role, keyed by field name. */
export type SemanticRoleOverrides = Record<string, SemanticRole>

// ===== DATASET ===============================================================
/** Fields of the loaded dataset; rows stay in the backend. */
export type Dataset = {
  fields: DataField[]
}

/** A single row as returned by table and points queries. */
export type DataRow = Record<string, DataValue>

export type DataValue = string | number | null

// ===== PROFILE ===============================================================
export type DatasetProfile = {
  dataset_id: string
  row_count: number
  column_count: number
  missing_count: number
  duplicate_rows: number
  fields: FieldProfile[]
}

export type FieldProfile = {
  name: string
  physical_type: PhysicalType
  semantic_role: SemanticRole
  missing_count: number
  unique_count: number
  statistics: FieldStatistics | null
}

export type FieldStatistics =
  MeasureStatistics | DimensionStatistics | TemporalStatistics

export type MeasureStatistics = {
  kind: 'measure'
  min: number | null
  max: number | null
  mean: number | null
  median: number | null
  histogram: number[]
}

export type DimensionStatistics = {
  kind: 'dimension'
  value_counts: ValueCount[]
}

export type TemporalGranularity = 'day' | 'week' | 'month' | 'quarter' | 'year'

export type TemporalStatistics = {
  kind: 'temporal'
  min: string | null
  max: string | null
  granularity: TemporalGranularity | null
  histogram: number[]
}

export type ValueCount = {
  value: string
  count: number
}
