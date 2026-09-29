import { useEffect, useState } from 'react'

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

  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent): void {
      const isShortcut =
        (event.metaKey || event.ctrlKey) && !event.altKey && !event.shiftKey
      if (!isShortcut) {
        return
      }

      const key = event.key.toLowerCase()
      if (key === 'b') {
        event.preventDefault()
        setIsBuildPanelCollapsed((currentValue) => !currentValue)
      }
      if (key === 'i') {
        event.preventDefault()
        setIsInspectorCollapsed((currentValue) => !currentValue)
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  return {
    isBuildPanelCollapsed,
    isInspectorCollapsed,
    toggleBuildPanel,
    toggleInspector,
  }
}
