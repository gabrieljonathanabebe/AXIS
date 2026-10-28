import { useSyncExternalStore } from 'react'

// ===== HELPERS ===============================================================
/**
 * Calls back when the theme on the document root changes.
 * @param onChange Callback of React's external store.
 * @returns Function that stops observing.
 */
function subscribe(onChange: () => void): () => void {
  const observer = new MutationObserver(onChange)
  observer.observe(document.documentElement, {
    attributeFilter: ['data-theme'],
  })
  return () => observer.disconnect()
}

/** Names the current theme, e.g. "dark". */
function getSnapshot(): string {
  return document.documentElement.dataset.theme ?? ''
}

// ===== HOOK ==================================================================
/**
 * Theme on the document root. A chart that reads CSS tokens into its
 * ECharts option lists it as a dependency, so it redraws when the theme
 * changes.
 * @returns Name of the current theme.
 */
export function useDocumentTheme(): string {
  return useSyncExternalStore(subscribe, getSnapshot)
}
