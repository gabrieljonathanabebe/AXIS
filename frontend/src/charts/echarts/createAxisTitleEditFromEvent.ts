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

export function createAxisTitleEditFromEvent(
  event: ECElementEvent,
): AxisTitleEdit | null {
  const axis = axisByComponentType[event.componentType]
  const target = event.event?.target
  if (!axis || !target || !isAxisTitleEvent(event)) {
    return null
  }
  const rect = target.getBoundingRect().clone()
  const transform = target.getComputedTransform()
  if (transform) {
    rect.applyTransform(transform)
  }
  return {
    axis,
    rect: {
      height: rect.height,
      width: rect.width,
      x: rect.x,
      y: rect.y,
    },
  }
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
