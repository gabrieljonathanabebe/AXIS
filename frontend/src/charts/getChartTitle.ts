import { hasAggregatedColor, isPointsChartType } from './chartDefinitions'
import { getAggregatedLabel, getValueLabel } from './getEffectiveAggregation'
import { getEffectiveTimeGrain } from './getEffectiveTimeGrain'

import type { DataField } from '@/datasets/types'
import type { ChartInstance } from './types'

export function getDefaultChartTitle(
  chart: ChartInstance,
  fields: DataField[],
): string {
  const { x, y } = chart.spec.data.encoding
  if (!x && !y) {
    return 'Untitled Chart'
  }
  const xLabel =
    getEffectiveTimeGrain(chart.spec.data, fields) ?? x ?? 'Category'
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

/**
 * Default title of the continuous color scale: the field that colors the
 * marks, with its aggregation when the chart aggregates it, e.g. "Mean of
 * profit" on bars or "profit" on a scatter.
 * @param chart Chart with the color field.
 * @returns Name of the color metric, or an empty text without one.
 */
export function getDefaultColorScaleTitle(chart: ChartInstance): string {
  const { colorAggregation, encoding } = chart.spec.data
  if (!encoding.color) {
    return ''
  }
  return hasAggregatedColor(chart.type, encoding)
    ? getAggregatedLabel(encoding.color, colorAggregation)
    : encoding.color
}
