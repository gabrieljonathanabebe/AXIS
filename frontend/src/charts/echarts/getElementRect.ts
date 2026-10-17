import type { ElementEvent } from 'echarts'

import type { ElementRect } from '../../objects/types'

// ===== TYPES =================================================================
/** Something ECharts draws on its canvas: a text, a shape or a group. */
type ChartElement = ElementEvent['target']

// ===== FUNCTION ==============================================================
/**
 * Measures an element drawn by ECharts, including its offset and rotation.
 * @param element Text, shape or group on the ECharts canvas.
 * @returns Bounds of the element inside the canvas.
 */
export function getElementRect(element: ChartElement): ElementRect {
  const rect = element.getBoundingRect().clone()
  const transform = element.getComputedTransform()
  if (transform) {
    rect.applyTransform(transform)
  }
  return {
    height: rect.height,
    width: rect.width,
    x: rect.x,
    y: rect.y,
  }
}
