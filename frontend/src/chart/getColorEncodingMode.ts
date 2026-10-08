import type { ChartEncoding, ChartType } from '../types/chart'
import type { DataField } from '../datasets/types'
import { isRadialChartType } from './isRadialChartType'

export type ColorEncodingMode = 'constant' | 'categorical' | 'continuous'

export function getColorEncodingMode(
  chartType: ChartType,
  encoding: ChartEncoding,
  fields: DataField[],
): ColorEncodingMode {
  if (isRadialChartType(chartType)) {
    return 'categorical'
  }
  const colorField = fields.find((field) => field.name === encoding.color)
  if (colorField?.semantic_role === 'measure') {
    return 'continuous'
  }
  if (encoding.color || encoding.series) {
    return 'categorical'
  }
  return 'constant'
}
