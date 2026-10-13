import type {
  ChartAggregationKey,
  ChartAppearanceSpec,
  ChartDataSpec,
  ChartEncoding,
  ChartInteractionSpec,
  ChartMarkKey,
  ChartSpec,
  ChartType,
} from '../charts/types'
import type {
  DashboardObject,
  ObjectContainer,
  ObjectLayout,
} from '../objects/types'
import type { DataField, DataValue } from '../datasets/types'

// ===== STATE =================================================================
export type WorkspaceState = {
  dashboard: DashboardSpec
  objects: DashboardObject[]
  selectedObjectId: string | null
  selection: DataSelection | null
}

// ===== ACTIONS ===============================================================
export type WorkspaceAction =
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
      type: 'object/add'
      object: DashboardObject
    }
  | {
      type: 'object/duplicate'
      objectId: string
      newObjectId: string
    }
  | {
      type: 'object/remove'
      objectId: string
    }
  | {
      type: 'object/select'
      objectId: string | null
    }
  | {
      type: 'object/updateContainer'
      objectId: string
      patch: Partial<ObjectContainer>
    }
  | {
      type: 'object/updateLayout'
      objectId: string
      patch: Partial<ObjectLayout>
    }
  | {
      type: 'selection/clear'
    }
  | {
      type: 'selection/set'
      selection: DataSelection
    }

/** Everything the canvas changes on objects, charts and the data selection. */
export type CanvasActions = {
  clearSelection: () => void
  selectData: (selection: DataSelection) => void
  selectObject: (objectId: string | null) => void
  updateChartAppearance: <TKey extends keyof ChartAppearanceSpec>(
    chartId: string,
    key: TKey,
    value: ChartAppearanceSpec[TKey],
  ) => void
  updateObjectLayout: (objectId: string, layout: ObjectLayout) => void
}

// ===== HISTORY ===============================================================
export type WorkspaceSnapshot = Pick<
  WorkspaceState,
  'dashboard' | 'objects' | 'selectedObjectId'
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

export type ObjectLayoutMode = 'move' | ObjectResizeDirection

export type ObjectResizeDirection =
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
      kind: 'object-layout'
      mode: ObjectLayoutMode
      objectId: string
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
