import type { ChartType } from './types'

export type RadialChartType = Extract<ChartType, 'pie' | 'donut'>

export function isRadialChartType(
  chartType: ChartType,
): chartType is RadialChartType {
  return chartType === 'pie' || chartType === 'donut'
}
