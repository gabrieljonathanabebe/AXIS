import { useState } from 'react'

import type { WorkspaceView } from '../types/ui'

type useWorkspaceLayoutResults = {
  activeWorkspace: WorkspaceView
  isBuildPanelCollapsed: boolean
  isInspectorCollapsed: boolean
  setActiveWorkspace: (workspace: WorkspaceView) => void
  toggleBuildPanel: () => void
  toggleInspector: () => void
}

export function useWorkspaceLayout(): useWorkspaceLayoutResults {
  const [activeWorkspace, setActiveWorkspace] =
    useState<WorkspaceView>('visualize')
  const [isBuildPanelCollapsed, setIsBuildPanelCollapsed] = useState(false)
  const [isInspectorCollapsed, setIsInspectorCollapsed] = useState(false)

  function toggleBuildPanel(): void {
    setIsBuildPanelCollapsed((currentValue) => !currentValue)
  }

  function toggleInspector(): void {
    setIsInspectorCollapsed((currentValue) => !currentValue)
  }

  return {
    activeWorkspace,
    isBuildPanelCollapsed,
    isInspectorCollapsed,
    setActiveWorkspace,
    toggleBuildPanel,
    toggleInspector,
  }
}
