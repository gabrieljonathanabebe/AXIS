import type { ECElementEvent } from 'echarts'

import { getElementRect } from './getElementRect'

import type { ChartFormatElement } from '../types'
import type { ElementRect } from '../../objects/types'

// ===== TYPES =================================================================
/** A format element under the pointer and its bounds inside the canvas. */
type ChartFormatHint = {
  element: ChartFormatElement
  rect: ElementRect
}

// ===== CONSTANTS =============================================================
const axisLabelsByComponentType: Partial<Record<string, ChartFormatElement>> = {
  xAxis: 'xAxisLabels',
  yAxis: 'yAxisLabels',
}

// ===== FUNCTION ==============================================================
/**
 * Finds the format element under the pointer and measures it as a whole:
 * the legend with all its items, the labels of an axis with all ticks. Marks
 * are measured one by one, a line as its whole path.
 * @param event ECharts mouse event; legend, axes and lines emit it via
 *   `triggerEvent`.
 * @returns Element and bounds inside the canvas, or null for other events.
 */
export function createFormatHintFromEvent(
  event: ECElementEvent,
): ChartFormatHint | null {
  const target = event.event?.target
  if (!target) {
    return null
  }
  if (event.componentType === 'legend') {
    let legend = target
    while (legend.parent) {
      legend = legend.parent
    }
    return { element: 'legend', rect: getElementRect(legend) }
  }
  const axisLabels = axisLabelsByComponentType[event.componentType]
  if (axisLabels && event.targetType === 'axisLabel') {
    let labels = target
    while (!labels.isGroup && labels.parent) {
      labels = labels.parent
    }
    return { element: axisLabels, rect: getElementRect(labels) }
  }
  if (event.componentType === 'series') {
    return { element: 'marks', rect: getElementRect(target) }
  }
  return null
}
