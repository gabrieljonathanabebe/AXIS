import { isRadialChartType } from './chartDefinitions'
import { getColorEncodingMode } from './getColorEncodingMode'
import { isLegendRelevant } from './isLegendRelevant'

import type { DataField } from '../datasets/types'
import type { ObjectFormatElement } from '../objects/types'
import type { ChartFormatElement, ChartInstance } from './types'

const chartFormatElements: readonly ObjectFormatElement[] = [
  'colorScale',
  'container',
  'legend',
  'marks',
  'title',
  'tooltip',
  'xAxis',
  'xAxisLabels',
  'yAxis',
  'yAxisLabels',
] satisfies ChartFormatElement[]

/**
 * Tells whether a format element belongs to charts.
 * @param element Element of a format target, or null when none is open.
 * @returns True for container, title, marks, tooltip, axes, axis labels,
 *   legend and color scale.
 */
export function isChartFormatElement(
  element: ObjectFormatElement | null,
): element is ChartFormatElement {
  return element !== null && chartFormatElements.includes(element)
}

/**
 * Lists the elements of a chart that can be formatted, in reading order.
 * @param chart Chart whose elements are listed.
 * @param fields Dataset fields, which decide whether a legend or a color
 *   scale is relevant.
 * @returns The container, title, marks and tooltip, the axes and their
 *   labels of cartesian charts, a relevant legend and a continuous color
 *   scale.
 */
export function getFormatElements(
  chart: ChartInstance,
  fields: DataField[],
): ChartFormatElement[] {
  const elements: ChartFormatElement[] = [
    'container',
    'title',
    'marks',
    'tooltip',
  ]
  if (!isRadialChartType(chart.type)) {
    elements.push('xAxis', 'xAxisLabels', 'yAxis', 'yAxisLabels')
  }
  if (isLegendRelevant(chart, fields)) {
    elements.push('legend')
  }
  if (
    getColorEncodingMode(chart.type, chart.spec.data.encoding, fields) ===
    'continuous'
  ) {
    elements.push('colorScale')
  }
  return elements
}
