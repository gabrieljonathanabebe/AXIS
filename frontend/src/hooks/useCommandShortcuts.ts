import { useEffect } from 'react'

import type { CommandShortcut, WorkspaceCommand } from '../types/ui'

// ===== HELPERS ===============================================================
function isEditableTarget(target: EventTarget | null): boolean {
  return (
    target instanceof HTMLElement &&
    (target.isContentEditable || target.matches('input, select, textarea'))
  )
}

function isInCommandScope(
  command: WorkspaceCommand,
  target: EventTarget | null,
): boolean {
  if (command.scope === 'global') {
    return true
  }
  return target instanceof HTMLElement && target.matches('.chart-item')
}

function matchesShortcut(
  event: KeyboardEvent,
  shortcut: CommandShortcut,
): boolean {
  const hasMod = event.metaKey || event.ctrlKey
  return (
    event.key.toLowerCase() === shortcut.key &&
    hasMod === (shortcut.mod ?? false) &&
    event.shiftKey === (shortcut.shift ?? false) &&
    !event.altKey
  )
}

// ===== FUNCTION ==============================================================
export function useCommandShortcuts(commands: WorkspaceCommand[]): void {
  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent): void {
      if (event.defaultPrevented || isEditableTarget(event.target)) {
        return
      }
      const matchingCommand = commands.find((command) => {
        return (
          isInCommandScope(command, event.target) &&
          command.shortcuts.some((shortcut) => {
            return matchesShortcut(event, shortcut)
          })
        )
      })
      if (!matchingCommand?.isEnabled) {
        return
      }
      event.preventDefault()
      matchingCommand.run()
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [commands])
}
