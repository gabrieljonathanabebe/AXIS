import type { LucideIcon } from 'lucide-react'

import { chartDefinitionList } from '../charts/chartDefinitions'

import type { DashboardObjectKind, ObjectSize, ObjectTemplate } from './types'

// ===== TYPES =================================================================
/** One entry in the picker of the Build panel. */
export type ObjectPickerOption = {
  addLabel: string
  icon: LucideIcon
  label: string
  template: ObjectTemplate
}

/** What the canvas needs to know about a kind of object. */
export type ObjectDefinition = {
  defaultSize: ObjectSize
  kind: DashboardObjectKind
  options: ObjectPickerOption[]
}

// ===== CONSTANTS =============================================================
export const objectDefinitions = {
  chart: {
    defaultSize: { height: 14, width: 12 },
    kind: 'chart',
    options: chartDefinitionList.map(({ icon, label, type }) => ({
      addLabel: `Add ${label} chart`,
      icon,
      label,
      template: { chartType: type, kind: 'chart' },
    })),
  },
} satisfies Record<DashboardObjectKind, ObjectDefinition>

export const objectPickerOptions = Object.values(objectDefinitions).flatMap(
  (definition) => definition.options,
)

// ===== FUNCTIONS =============================================================
/** Looks up what the canvas knows about a kind of object. */
export function getObjectDefinition(
  kind: DashboardObjectKind,
): ObjectDefinition {
  return objectDefinitions[kind]
}
