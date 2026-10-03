import type { Aggregation, ChartEncoding, ChartType } from './chart'
import type { WorkspaceAction } from './workspace'

// ===== ACTIONS ===============================================================
// External, intent-level actions (e.g. from AI). Fields are addressed by
// name; ids, layouts and default specs are added when executed.
export type CevynAction = {
  type: 'chart/create'
  aggregation?: Aggregation
  chartType: ChartType
  encoding?: ChartEncoding
}

// ===== VALIDATION ============================================================
export type CevynActionError = {
  index: number
  message: string
}

export type CevynActionResult =
  | {
      ok: false
      errors: CevynActionError[]
    }
  | {
      ok: true
      workspaceActions: WorkspaceAction[]
    }
