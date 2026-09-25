import type { ChartEncoding, ChartType } from '../types/chart'
import { isRadialChartType } from './isRadialChartType'

export type ColorEncodingMode = 'constant' | 'categorical' | 'continuous'

export function getColorEncodingMode(
  chartType: ChartType,
  encoding: ChartEncoding,
): ColorEncodingMode {
  if (isRadialChartType(chartType)) {
    return 'categorical'
  }
  if (encoding.color?.semantic_type === 'numeric') {
    return 'continuous'
  }
  if (encoding.color || encoding.series) {
    return 'categorical'
  }
  return 'constant'
}
