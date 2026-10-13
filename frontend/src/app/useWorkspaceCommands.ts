import {
  Copy,
  Paintbrush,
  PanelLeft,
  PanelRight,
  Redo2,
  Trash2,
  Undo2,
} from 'lucide-react'

import { useCommandShortcuts } from './useCommandShortcuts'

import type { WorkspaceCommands } from './types'

// ===== TYPES =================================================================
type UseWorkspaceCommandsParams = {
  canRedo: boolean
  canUndo: boolean
  isFormatOpen: boolean
  selectedObjectId: string | null
  onCloseFormat: () => void
  onDuplicateObject: (objectId: string) => void
  onFormatObject: (objectId: string) => void
  onRedo: () => void
  onRemoveObject: (objectId: string) => void
  onToggleBuildPanel: () => void
  onToggleInspector: () => void
  onUndo: () => void
}

// ===== FUNCTION ==============================================================
/** Defines the workspace commands and binds their keyboard shortcuts. */
export function useWorkspaceCommands({
  canRedo,
  canUndo,
  isFormatOpen,
  selectedObjectId,
  onCloseFormat,
  onDuplicateObject,
  onFormatObject,
  onRedo,
  onRemoveObject,
  onToggleBuildPanel,
  onToggleInspector,
  onUndo,
}: UseWorkspaceCommandsParams): WorkspaceCommands {
  const commands: WorkspaceCommands = {
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
    'object.delete': {
      icon: Trash2,
      id: 'object.delete',
      isEnabled: selectedObjectId !== null,
      label: 'Delete chart',
      run: () => {
        if (selectedObjectId) {
          onRemoveObject(selectedObjectId)
        }
      },
      scope: 'object',
      shortcuts: [{ key: 'backspace' }, { key: 'delete' }],
    },
    'object.duplicate': {
      icon: Copy,
      id: 'object.duplicate',
      isEnabled: selectedObjectId !== null,
      label: 'Duplicate chart',
      run: () => {
        if (selectedObjectId) {
          onDuplicateObject(selectedObjectId)
        }
      },
      scope: 'object',
      shortcuts: [{ key: 'd', mod: true }],
    },
    'object.format': {
      icon: Paintbrush,
      id: 'object.format',
      isActive: isFormatOpen,
      isEnabled: selectedObjectId !== null,
      label: 'Format chart',
      run: () => {
        if (isFormatOpen) {
          onCloseFormat()
        } else if (selectedObjectId) {
          onFormatObject(selectedObjectId)
        }
      },
      scope: 'object',
      shortcuts: [],
    },
  }

  useCommandShortcuts(Object.values(commands))

  return commands
}
