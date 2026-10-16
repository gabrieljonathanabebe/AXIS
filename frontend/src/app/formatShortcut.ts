import type { CommandShortcut } from './types'

// ===== CONSTANTS =============================================================
const isMac = /Mac|iPhone|iPad/.test(navigator.userAgent)

/** Keys whose name is not just the upper-case letter. */
const keyLabels: Record<string, { mac: string; other: string }> = {
  backspace: { mac: '⌫', other: 'Backspace' },
  delete: { mac: '⌦', other: 'Delete' },
  enter: { mac: '↵', other: 'Enter' },
}

// ===== FUNCTION ==============================================================
/** Shortcut as shown to the user, e.g. ⇧⌘Z on a Mac, Ctrl+Shift+Z elsewhere. */
export function formatShortcut(shortcut: CommandShortcut): string {
  const label = keyLabels[shortcut.key]
  const key = label
    ? isMac
      ? label.mac
      : label.other
    : shortcut.key.toUpperCase()
  if (isMac) {
    return `${shortcut.shift ? '⇧' : ''}${shortcut.mod ? '⌘' : ''}${key}`
  }
  return [shortcut.mod ? 'Ctrl' : '', shortcut.shift ? 'Shift' : '', key]
    .filter(Boolean)
    .join('+')
}
