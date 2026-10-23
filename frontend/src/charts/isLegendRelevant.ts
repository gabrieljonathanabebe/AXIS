import { getColorEncodingMode } from './getColorEncodingMode'

import type { DataField } from '../datasets/types'
import type { ChartInstance } from './types'

export function isLegendRelevant(
  chart: ChartInstance,
  fields: DataField[],
): boolean {
  return (
    getColorEncodingMode(chart.type, chart.spec.data.encoding, fields) ===
    'categorical'
  )
}
