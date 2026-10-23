import { ChartColumn, LayoutPanelTop, RectangleHorizontal } from 'lucide-react'

import { chartDefinitionList } from '../charts/chartDefinitions'

import type { LucideIcon } from 'lucide-react'
import type { DashboardObjectKind, ObjectSize, ObjectTemplate } from './types'

// ===== TYPES =================================================================
/** Section of the Build panel picker that a kind of object belongs to. */
export type ObjectGroup = 'charts' | 'cards'

/** Title and icon of a picker section. */
export type ObjectGroupDefinition = {
  group: ObjectGroup
  icon: LucideIcon
  title: string
}

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
  group: ObjectGroup
  kind: DashboardObjectKind
  label: string
  minSize: ObjectSize
  options: ObjectPickerOption[]
}

// ===== CONSTANTS =============================================================
export const objectDefinitions = {
  chart: {
    defaultSize: { height: 14, width: 12 },
    group: 'charts',
    kind: 'chart',
    label: 'chart',
    minSize: { height: 10, width: 6 },
    options: chartDefinitionList.map(({ icon, label, type }) => ({
      addLabel: `Add ${label} chart`,
      icon,
      label,
      template: { chartType: type, kind: 'chart' },
    })),
  },
  card: {
    defaultSize: { height: 7, width: 6 },
    group: 'cards',
    kind: 'card',
    label: 'card',
    minSize: { height: 5, width: 4 },
    options: [
      {
        addLabel: 'Add card',
        icon: RectangleHorizontal,
        label: 'Card',
        template: { kind: 'card' },
      },
    ],
  },
} satisfies Record<DashboardObjectKind, ObjectDefinition>

export const objectGroups: ObjectGroupDefinition[] = [
  { group: 'charts', icon: ChartColumn, title: 'Charts' },
  { group: 'cards', icon: LayoutPanelTop, title: 'Cards & Table' },
]

// ===== FUNCTIONS =============================================================
/** Looks up what the canvas knows about a kind of object. */
export function getObjectDefinition(
  kind: DashboardObjectKind,
): ObjectDefinition {
  return objectDefinitions[kind]
}

/**
 * Lists the picker options of one section, in registry order.
 * @param group Section of the Build panel picker.
 * @returns The options of every kind of object in that section.
 */
export function getGroupPickerOptions(
  group: ObjectGroup,
): ObjectPickerOption[] {
  return Object.values(objectDefinitions)
    .filter((definition) => definition.group === group)
    .flatMap((definition): ObjectPickerOption[] => definition.options)
}
