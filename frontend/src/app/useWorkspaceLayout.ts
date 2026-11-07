import { useState } from 'react'

import type { WorkspaceView } from './types'

type useWorkspaceLayoutResults = {
  activeWorkspace: WorkspaceView
  isBuildPanelCollapsed: boolean
  isFormatPanelCollapsed: boolean
  setActiveWorkspace: (workspace: WorkspaceView) => void
  setIsFormatPanelCollapsed: (isCollapsed: boolean) => void
  toggleBuildPanel: () => void
  toggleFormatPanel: () => void
}

export function useWorkspaceLayout(): useWorkspaceLayoutResults {
  const [activeWorkspace, setActiveWorkspace] =
    useState<WorkspaceView>('visualize')
  const [isBuildPanelCollapsed, setIsBuildPanelCollapsed] = useState(false)
  const [isFormatPanelCollapsed, setIsFormatPanelCollapsed] = useState(false)

  function toggleBuildPanel(): void {
    setIsBuildPanelCollapsed((currentValue) => !currentValue)
  }

  /** Expands or collapses the format panel at the right of the canvas. */
  function toggleFormatPanel(): void {
    setIsFormatPanelCollapsed((currentValue) => !currentValue)
  }

  return {
    activeWorkspace,
    isBuildPanelCollapsed,
    isFormatPanelCollapsed,
    setActiveWorkspace,
    setIsFormatPanelCollapsed,
    toggleBuildPanel,
    toggleFormatPanel,
  }
}
