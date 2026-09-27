import type { ChartEncoding, ChartType, DataField } from './chart'

export type ActiveSidePanel = 'fields' | 'charts' | 'settings'

export type ChartLayoutMode = 'move' | ChartResizeDirection

export type ChartResizeDirection =
  'e' | 'n' | 'ne' | 'nw' | 's' | 'se' | 'sw' | 'w'

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
