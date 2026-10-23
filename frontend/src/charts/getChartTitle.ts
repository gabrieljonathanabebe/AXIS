import { isPointsChartType } from './chartDefinitions'
import { getValueLabel } from './getEffectiveAggregation'

import type { DataField } from '../datasets/types'
import type { ChartInstance } from './types'

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

// Mirrors the axis names in the ECharts adapter: x shows its field,
// y the value label (e.g. "Count of country").
export function getDefaultAxisTitle(
  chart: ChartInstance,
  fields: DataField[],
  axis: 'x' | 'y',
): string {
  const { data } = chart.spec
  return (axis === 'x' ? data.encoding.x : getValueLabel(data, fields)) ?? ''
}
