import type { LucideIcon } from 'lucide-react'

export type CommandScope = 'chart' | 'global'

export type CommandShortcut = {
  key: string
  mod?: boolean
  shift?: boolean
}

export type WorkspaceCommandId =
  | 'chart.delete'
  | 'chart.duplicate'
  | 'chart.format'
  | 'history.redo'
  | 'history.undo'
  | 'layout.toggleBuildPanel'
  | 'layout.toggleInspector'

export type WorkspaceCommand = {
  icon: LucideIcon
  id: WorkspaceCommandId
  /** Pressed state of a toggle command, e.g. while its popover is open. */
  isActive?: boolean
  isEnabled: boolean
  label: string
  run: () => void
  scope: CommandScope
  shortcuts: CommandShortcut[]
}

export type WorkspaceCommands = Record<WorkspaceCommandId, WorkspaceCommand>

export type WorkspaceView = 'data' | 'visualize'
