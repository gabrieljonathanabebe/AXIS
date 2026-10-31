import { createCardInstance } from '../cards/createCardInstance'
import { createChartInstance } from '../charts/createChartInstance'
import { findFreeLayout } from '../workspace/chartLayout'
import { getObjectDefinition } from './objectDefinitions'

import type { DashboardStyle } from '../dashboardStyle/types'
import type { DashboardObject, ObjectTemplate } from './types'

/**
 * Creates the object a picker option stands for, in the first free spot.
 * @param template Kind of object and what it starts with.
 * @param objects Objects already on the canvas.
 * @param style Current dashboard style the object is created in.
 * @returns The new object with a new ID and the defaults of its kind.
 */
export function createObject(
  template: ObjectTemplate,
  objects: DashboardObject[],
  style: DashboardStyle,
): DashboardObject {
  const { defaultSize } = getObjectDefinition(template.kind)
  const layout = findFreeLayout(objects, defaultSize)
  switch (template.kind) {
    case 'chart':
      return createChartInstance({ layout, style, type: template.chartType })
    case 'card':
      return createCardInstance({ layout, style })
  }
}
