import type { Aggregation, ChartEncoding, ChartType } from './chart'
import type { WorkspaceAction } from './workspace'

// ===== ACTIONS ===============================================================
// External, intent-level actions (e.g. from AI). Fields are addressed by
// name, existing charts by id; ids, layouts and default specs are added when
// executed.

export type CevynAction =
  | {
      type: 'chart/create'
      aggregation?: Aggregation
      chartType: ChartType
      encoding?: ChartEncoding
    }
  | {
      type: 'chart/remove'
      chartId: string
    }
  | {
      type: 'chart/setTitle'
      chartId: string
      title: string
    }
  | {
      type: 'chart/setType'
      chartId: string
      chartType: ChartType
    }
  | {
      type: 'chart/updateAggregation'
      aggregation: Aggregation
      chartId: string
    }
  | {
      type: 'chart/updateEncoding'
      chartId: string
      encoding: ChartEncoding
    }

// ===== VALIDATION ============================================================
// index is omitted for errors that concern the whole batch.
export type CevynActionError = {
  index?: number
  message: string
}

export type CevynActionParseResult =
  | {
      ok: false
      errors: CevynActionError[]
    }
  | {
      ok: true
      actions: CevynAction[]
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
