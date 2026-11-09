// ===== CONSTANTS =============================================================
/** Whether the app runs on a Mac, iPhone or iPad, where ⌘ is the command key. */
export const isMac = /Mac|iPhone|iPad/.test(navigator.userAgent)

/** Name of the format key in hints, e.g. "⌘-click any part". */
export const formatKeyLabel = isMac ? '⌘' : 'Ctrl'

// ===== FUNCTION ==============================================================
/**
 * Tells whether a click asks to format what it hits instead of its main
 * action: ⌘-click on a Mac, Ctrl-click elsewhere. Ctrl-click stays free on
 * a Mac, where it opens the context menu.
 * @param event Mouse or pointer event of the click.
 * @returns True for a format click.
 */
export function isFormatClick(event: {
  ctrlKey: boolean
  metaKey: boolean
}): boolean {
  return isMac ? event.metaKey : event.ctrlKey
}
