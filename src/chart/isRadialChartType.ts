import type { ChartType } from '../types/chart'

export type RadialChartType = Extract<ChartType, 'pie' | 'donut'>

export function isRadialChartType(
  chartType: ChartType,
): chartType is RadialChartType {
  return chartType === 'pie' || chartType === 'donut'
}
