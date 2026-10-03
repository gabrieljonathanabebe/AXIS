import type { ChartInstance, DataField } from '../types/chart'
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
