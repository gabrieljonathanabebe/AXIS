import type { LucideIcon } from 'lucide-react'

import type { ChartEncoding, ChartType } from './chart'
import type { DataField } from '../datasets/types'

export type ActiveSidePanel = 'fields' | 'charts' | 'settings'

export type AxisTitleEdit = {
  axis: 'x' | 'y'
  rect: {
    height: number
    width: number
    x: number
    y: number
  }
}

export type ChartLayoutMode = 'move' | ChartResizeDirection

export type ChartResizeDirection =
  'e' | 'n' | 'ne' | 'nw' | 's' | 'se' | 'sw' | 'w'

export type DataView = 'profile' | 'table'

export type HistogramBar = {
  count: number
  isMuted?: boolean
  label: string
}

export type WorkspaceView = 'data' | 'visualize'

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

export type CommandScope = 'chart' | 'global'

export type CommandShortcut = {
  key: string
  mod?: boolean
  shift?: boolean
}

export type WorkspaceCommandId =
  | 'chart.delete'
  | 'chart.duplicate'
  | 'history.redo'
  | 'history.undo'
  | 'layout.toggleBuildPanel'
  | 'layout.toggleInspector'

export type WorkspaceCommand = {
  icon: LucideIcon
  id: WorkspaceCommandId
  isEnabled: boolean
  label: string
  run: () => void
  scope: CommandScope
  shortcuts: CommandShortcut[]
}

export type WorkspaceCommands = Record<WorkspaceCommandId, WorkspaceCommand>
