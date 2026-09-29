import { useState } from 'react'

type useWorkspaceLayoutResults = {
  isBuildPanelCollapsed: boolean
  isInspectorCollapsed: boolean
  toggleBuildPanel: () => void
  toggleInspector: () => void
}

export function useWorkspaceLayout(): useWorkspaceLayoutResults {
  const [isBuildPanelCollapsed, setIsBuildPanelCollapsed] = useState(false)
  const [isInspectorCollapsed, setIsInspectorCollapsed] = useState(false)

  function toggleBuildPanel(): void {
    setIsBuildPanelCollapsed((currentValue) => !currentValue)
  }

  function toggleInspector(): void {
    setIsInspectorCollapsed((currentValue) => !currentValue)
  }

  return {
    isBuildPanelCollapsed,
    isInspectorCollapsed,
    toggleBuildPanel,
    toggleInspector,
  }
}
