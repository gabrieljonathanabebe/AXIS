import { useState } from 'react'

import type { WorkspaceView } from './types'

type useWorkspaceLayoutResults = {
  activeWorkspace: WorkspaceView
  isBuildPanelCollapsed: boolean
  setActiveWorkspace: (workspace: WorkspaceView) => void
  toggleBuildPanel: () => void
}

export function useWorkspaceLayout(): useWorkspaceLayoutResults {
  const [activeWorkspace, setActiveWorkspace] =
    useState<WorkspaceView>('visualize')
  const [isBuildPanelCollapsed, setIsBuildPanelCollapsed] = useState(false)

  function toggleBuildPanel(): void {
    setIsBuildPanelCollapsed((currentValue) => !currentValue)
  }

  return {
    activeWorkspace,
    isBuildPanelCollapsed,
    setActiveWorkspace,
    toggleBuildPanel,
  }
}
