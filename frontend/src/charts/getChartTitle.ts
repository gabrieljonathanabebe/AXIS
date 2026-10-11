import { isPointsChartType } from './chartDefinitions'
import { getValueLabel } from './getEffectiveAggregation'

import type { ChartInstance } from './types'
import type { DataField } from '../datasets/types'

export function getDefaultChartTitle(
  chart: ChartInstance,
  fields: DataField[],
): string {
  const { x, y } = chart.spec.data.encoding
  if (!x && !y) {
    return 'Untitled Chart'
  }
  const xLabel = x ?? 'Category'
  const yLabel = getValueLabel(chart.spec.data, fields) ?? 'Value'
  return isPointsChartType(chart.type)
    ? `${yLabel} vs. ${xLabel}`
    : `${yLabel} by ${xLabel}`
}

export function getChartTitle(
  chart: ChartInstance,
  fields: DataField[],
): string {
  return (
    chart.spec.appearance.title.text.trim() ||
    getDefaultChartTitle(chart, fields)
  )
}
