import { isLegendRelevant } from './isLegendRelevant'
import { isRadialChartType } from './chartDefinitions'

import type { ChartFormatElement, ChartInstance } from './types'
import type { DataField } from '../datasets/types'

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
