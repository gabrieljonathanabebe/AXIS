import type { ChartType, DataField } from './chart'

export type ActiveSidePanel = 'fields' | 'charts' | 'settings'

export type WorkspaceView = 'chart' | 'data'

export type DragPayload =
  | {
      kind: 'field'
      field: DataField
    }
  | {
      kind: 'chart-type'
      chartType: ChartType
    }

export type ActiveDrag = DragPayload | null
