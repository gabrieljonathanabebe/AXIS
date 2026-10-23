import { getElementRect } from './getElementRect'

import type { ECElementEvent, ECharts } from 'echarts'
import type { AxisTitleEdit } from '../types'

// ===== CONSTANTS =============================================================
const axisByComponentType: Partial<Record<string, AxisTitleEdit['axis']>> = {
  xAxis: 'x',
  yAxis: 'y',
}

// ===== FUNCTIONS =============================================================
export function isAxisTitleEvent(event: ECElementEvent): boolean {
  return (
    axisByComponentType[event.componentType] !== undefined &&
    event.targetType === 'axisName'
  )
}

/**
 * Measures the axis title under the pointer for inline editing and hints.
 * @param event ECharts mouse event; axis titles emit it via `triggerEvent`.
 * @returns The axis and the bounds of its title, or null for other events.
 */
export function createAxisTitleEditFromEvent(
  event: ECElementEvent,
): AxisTitleEdit | null {
  const axis = axisByComponentType[event.componentType]
  const target = event.event?.target
  if (!axis || !target || !isAxisTitleEvent(event)) {
    return null
  }
  return { axis, rect: getElementRect(target) }
}

export function syncAxisTitleEdit(
  instance: ECharts,
  editingAxis: AxisTitleEdit['axis'] | null,
): void {
  if (!editingAxis) {
    return
  }
  const hiddenName = { nameTextStyle: { opacity: 0 } }
  instance.setOption(
    editingAxis === 'x' ? { xAxis: hiddenName } : { yAxis: hiddenName },
  )
}
