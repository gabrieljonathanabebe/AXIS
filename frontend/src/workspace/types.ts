import type {
  ChartAggregationKey,
  ChartAppearanceSpec,
  ChartContainerAppearance,
  ChartDataSpec,
  ChartEncoding,
  ChartInstance,
  ChartInteractionSpec,
  ChartLayout,
  ChartMarkKey,
  ChartSpec,
  ChartType,
} from '../charts/types'
import type { DataField, DataValue } from '../datasets/types'

// ===== STATE =================================================================
export type WorkspaceState = {
  charts: ChartInstance[]
  dashboard: DashboardSpec
  selectedChartId: string | null
  selection: DataSelection | null
}

// ===== ACTIONS ===============================================================
export type WorkspaceAction =
  | {
      type: 'chart/add'
      chart: ChartInstance
    }
  | {
      type: 'chart/duplicate'
      chartId: string
      newChartId: string
    }
  | {
      type: 'chart/remove'
      chartId: string
    }
  | {
      type: 'chart/select'
      chartId: string | null
    }
  | {
      type: 'chart/setType'
      chartId: string
      chartType: ChartType
      defaultSpec: ChartSpec
    }
  | {
      type: 'chart/updateAggregation'
      chartId: string
      patch: Partial<Pick<ChartDataSpec, ChartAggregationKey>>
    }
  | {
      type: 'chart/updateAppearance'
      chartId: string
      patch: Partial<ChartAppearanceSpec>
    }
  | {
      type: 'chart/updateContainer'
      chartId: string
      patch: Partial<ChartContainerAppearance>
    }
  | {
      type: 'chart/updateEncoding'
      chartId: string
      patch: Partial<ChartEncoding>
    }
  | {
      type: 'chart/updateInteraction'
      chartId: string
      patch: Partial<ChartInteractionSpec>
    }
  | {
      type: 'chart/updateLayout'
      chartId: string
      patch: Partial<ChartLayout>
    }
  | {
      type: 'chart/updateMarkAppearance'
      chartId: string
      mark: ChartMarkKey
      patch: Partial<ChartAppearanceSpec[ChartMarkKey]>
    }
  | {
      type: 'dashboard/update'
      patch: Partial<Pick<DashboardSpec, 'name'>>
    }
  | {
      type: 'dashboard/updateLayout'
      patch: Partial<DashboardSpec['layout']>
    }
  | {
      type: 'selection/clear'
    }
  | {
      type: 'selection/set'
      selection: DataSelection
    }

/** Everything the canvas changes on charts and the data selection. */
export type CanvasActions = {
  clearSelection: () => void
  selectChart: (chartId: string | null) => void
  selectData: (selection: DataSelection) => void
  updateChartAppearance: <TKey extends keyof ChartAppearanceSpec>(
    chartId: string,
    key: TKey,
    value: ChartAppearanceSpec[TKey],
  ) => void
  updateChartLayout: (chartId: string, layout: ChartLayout) => void
}

// ===== HISTORY ===============================================================
export type WorkspaceSnapshot = Pick<
  WorkspaceState,
  'charts' | 'dashboard' | 'selectedChartId'
>

export type WorkspaceHistoryState = {
  future: WorkspaceSnapshot[]
  lastCoalesceKey: string | null
  lastTimestamp: number
  past: WorkspaceSnapshot[]
  present: WorkspaceState
}

export type WorkspaceHistoryAction =
  | {
      type: 'history/apply'
      action: WorkspaceAction
      timestamp: number
    }
  | {
      type: 'history/applyBatch'
      actions: WorkspaceAction[]
      timestamp: number
    }
  | {
      type: 'history/redo'
    }
  | {
      type: 'history/undo'
    }

// ===== SELECTION =============================================================
export type SelectionFilter =
  | {
      kind: 'values'
      field: string
      values: DataValue[]
    }
  | {
      kind: 'range'
      field: string
      min: number
      max: number
    }

export type DataSelection = {
  sourceChartId: string
  filters: SelectionFilter[]
}

// ===== DASHBOARD =============================================================
export type DashboardLayout = {
  gap: number
}

export type DashboardSpec = {
  layout: DashboardLayout
  name: string
}

export type ChartLayoutMode = 'move' | ChartResizeDirection

export type ChartResizeDirection =
  'e' | 'n' | 'ne' | 'nw' | 's' | 'se' | 'sw' | 'w'

// ===== DRAG AND DROP =========================================================
export type DragPayload =
  | {
      kind: 'field'
      field: DataField
    }
  | {
      kind: 'chart-type'
      chartType: ChartType
    }
  | {
      kind: 'chart-layout'
      chartId: string
      mode: ChartLayoutMode
    }

export type ActiveDrag = DragPayload | null

export type DropTarget =
  | {
      kind: 'canvas'
    }
  | {
      kind: 'encoding'
      chartId: string
      encodingKey: keyof ChartEncoding
    }
