import type { ChartInstance } from './types'
import type { DataField } from '../datasets/types'
import { getColorEncodingMode } from './getColorEncodingMode'

export function isLegendRelevant(
  chart: ChartInstance,
  fields: DataField[],
): boolean {
  return (
    getColorEncodingMode(chart.type, chart.spec.data.encoding, fields) ===
    'categorical'
  )
}
