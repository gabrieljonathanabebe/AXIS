import type { ECElementEvent } from 'echarts'

import type { ChartElementRect } from '../types'

// ===== FUNCTION ==============================================================
/**
 * Measures the whole legend when the pointer is over one of its items.
 * @param event ECharts mouse event; legend items emit it via `triggerEvent`.
 * @returns Bounds of the legend inside the canvas, or null for other events.
 */
export function createLegendRectFromEvent(
  event: ECElementEvent,
): ChartElementRect | null {
  let element = event.event?.target
  if (event.componentType !== 'legend' || !element) {
    return null
  }
  while (element.parent) {
    element = element.parent
  }
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
