import type { DashboardObjectKind, ObjectSize } from './types'

// ===== TYPES =================================================================
/** What the canvas needs to know about a kind of object. */
export type ObjectDefinition = {
  defaultSize: ObjectSize
  kind: DashboardObjectKind
}

// ===== CONSTANTS =============================================================
export const objectDefinitions = {
  chart: {
    defaultSize: { height: 14, width: 12 },
    kind: 'chart',
  },
} satisfies Record<DashboardObjectKind, ObjectDefinition>
