import { isPointsChartType } from './chartDefinitions'

import type { ChartInstance } from './types'

export function getDefaultChartTitle(chart: ChartInstance): string {
  const { x, y } = chart.spec.data.encoding
  if (!x && !y) {
    return 'Untitled Chart'
  }
  const xLabel = x ?? 'Category'
  const yLabel = y ?? 'Value'
  return isPointsChartType(chart.type)
    ? `${yLabel} vs. ${xLabel}`
    : `${yLabel} by ${xLabel}`
}

export function getChartTitle(chart: ChartInstance): string {
  return chart.spec.appearance.title.text.trim() || getDefaultChartTitle(chart)
}
