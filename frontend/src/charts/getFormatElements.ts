import { isLegendRelevant } from './isLegendRelevant'
import { isRadialChartType } from './chartDefinitions'

import type { ChartFormatElement, ChartInstance } from './types'
import type { DataField } from '../datasets/types'
import type { ObjectFormatElement } from '../objects/types'

const chartFormatElements: readonly ObjectFormatElement[] = [
  'legend',
  'title',
  'xAxis',
  'yAxis',
] satisfies ChartFormatElement[]

/**
 * Tells whether a format element belongs to charts.
 * @param element Element of a format target, or null when none is open.
 * @returns True for title, axes and legend.
 */
export function isChartFormatElement(
  element: ObjectFormatElement | null,
): element is ChartFormatElement {
  return element !== null && chartFormatElements.includes(element)
}

/**
 * Lists the elements of a chart that can be formatted, in reading order.
 * @param chart Chart whose elements are listed.
 * @param fields Dataset fields, which decide whether a legend is relevant.
 * @returns The title, the axes of cartesian charts and a relevant legend.
 */
export function getFormatElements(
  chart: ChartInstance,
  fields: DataField[],
): ChartFormatElement[] {
  const elements: ChartFormatElement[] = ['title']
  if (!isRadialChartType(chart.type)) {
    elements.push('xAxis', 'yAxis')
  }
  if (isLegendRelevant(chart, fields)) {
    elements.push('legend')
  }
  return elements
}
