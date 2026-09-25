import type { ChartInstance } from '../types/chart'
import { getColorEncodingMode } from './getColorEncodingMode'

export function isLegendRelevant(chart: ChartInstance): boolean {
  return (
    getColorEncodingMode(chart.type, chart.spec.data.encoding) === 'categorical'
  )
}
