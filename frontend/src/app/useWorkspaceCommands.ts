import { Copy, PanelLeft, PanelRight, Redo2, Trash2, Undo2 } from 'lucide-react'

import { useCommandShortcuts } from './useCommandShortcuts'

import type { WorkspaceCommands } from './types'

// ===== TYPES =================================================================
type UseWorkspaceCommandsParams = {
  canRedo: boolean
  canUndo: boolean
  selectedChartId: string | null
  onDuplicateChart: (chartId: string) => void
  onRedo: () => void
  onRemoveChart: (chartId: string) => void
  onToggleBuildPanel: () => void
  onToggleInspector: () => void
  onUndo: () => void
}

// ===== FUNCTION ==============================================================
export function useWorkspaceCommands({
  canRedo,
  canUndo,
  selectedChartId,
  onDuplicateChart,
  onRedo,
  onRemoveChart,
  onToggleBuildPanel,
  onToggleInspector,
  onUndo,
}: UseWorkspaceCommandsParams): WorkspaceCommands {
  const commands: WorkspaceCommands = {
    'chart.delete': {
      icon: Trash2,
      id: 'chart.delete',
      isEnabled: selectedChartId !== null,
      label: 'Delete chart',
      run: () => {
        if (selectedChartId) {
          onRemoveChart(selectedChartId)
        }
      },
      scope: 'chart',
      shortcuts: [{ key: 'backspace' }, { key: 'delete' }],
    },
    'chart.duplicate': {
      icon: Copy,
      id: 'chart.duplicate',
      isEnabled: selectedChartId !== null,
      label: 'Duplicate chart',
      run: () => {
        if (selectedChartId) {
          onDuplicateChart(selectedChartId)
        }
      },
      scope: 'chart',
      shortcuts: [{ key: 'd', mod: true }],
    },
    'history.redo': {
      icon: Redo2,
      id: 'history.redo',
      isEnabled: canRedo,
      label: 'Redo',
      run: onRedo,
      scope: 'global',
      shortcuts: [
        { key: 'z', mod: true, shift: true },
        { key: 'y', mod: true },
      ],
    },
    'history.undo': {
      icon: Undo2,
      id: 'history.undo',
      isEnabled: canUndo,
      label: 'Undo',
      run: onUndo,
      scope: 'global',
      shortcuts: [{ key: 'z', mod: true }],
    },
    'layout.toggleBuildPanel': {
      icon: PanelLeft,
      id: 'layout.toggleBuildPanel',
      isEnabled: true,
      label: 'Toggle Build panel',
      run: onToggleBuildPanel,
      scope: 'global',
      shortcuts: [{ key: 'b', mod: true }],
    },
    'layout.toggleInspector': {
      icon: PanelRight,
      id: 'layout.toggleInspector',
      isEnabled: true,
      label: 'Toggle Inspector',
      run: onToggleInspector,
      scope: 'global',
      shortcuts: [{ key: 'i', mod: true }],
    },
  }

  useCommandShortcuts(Object.values(commands))

  return commands
}
